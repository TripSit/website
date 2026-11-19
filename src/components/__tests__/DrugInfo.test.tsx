import { render, screen } from "@testing-library/react";
import type { Category, Dose, Drug, Unit } from "tripsit_drug_db";
import DrugInfo from "../DrugInfo";

// Called on every chart render. In the browser, react-apexcharts redraws the chart whenever it
// re-renders with a new options object, so a render here stands for a redraw there.
const mockChartRender = jest.fn();
jest.mock(
  "next/dynamic",
  () => () =>
    function Chart({
      series,
      options,
    }: {
      series: unknown;
      options: {
        chart: unknown;
        colors?: unknown;
        xaxis?: { categories?: unknown };
        tooltip: {
          custom: (input: {
            seriesIndex: number;
            dataPointIndex: number;
            w: { config: { series: unknown } };
          }) => string;
        };
      };
    }) {
      mockChartRender(options.chart);
      return (
        <>
          <output aria-label="Chart series">{JSON.stringify(series)}</output>
          <output aria-label="Chart colours">
            {JSON.stringify(options.colors)}
          </output>
          <output aria-label="Chart rows">
            {JSON.stringify(options.xaxis?.categories)}
          </output>
          {Array.isArray(series) &&
            series.flatMap(
              (
                { name, data }: { name: string; data: { x: string }[] },
                seriesIndex,
              ) =>
                data.map(({ x }, dataPointIndex) => {
                  const html = options.tooltip.custom({
                    seriesIndex,
                    dataPointIndex,
                    w: { config: { series } },
                  });
                  return (
                    <output
                      key={`${x}-${name}`}
                      aria-label={`Tooltip for ${x} ${name}`}
                    >
                      {
                        new DOMParser().parseFromString(html, "text/html").body
                          .textContent
                      }
                    </output>
                  );
                }),
            )}
        </>
      );
    },
);

const drug = {
  name: "example",
  pretty_name: "Example compound",
  aliases: ["alias"],
  properties: {},
} as Drug;

test("renders older database records without properties", () => {
  render(
    <DrugInfo
      drugData={
        {
          name: "legacy",
          pretty_name: "Legacy",
          properties: undefined,
        } as unknown as Drug
      }
    />,
  );
  expect(screen.getByText("Legacy")).toBeVisible();
});

test("keeps dose text and charts the ranges for each route", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        dose_note: "Example dose note",
        formatted_dose: {
          oral: { common: "1-2mg", light: "unknown" },
          insufflated: { common: "3-4mg" },
        },
      }}
    />,
  );
  expect(screen.getByText("Example dose note")).toBeVisible();
  expect(screen.getByText("unknown")).toBeVisible();
  expect(screen.getByText("1-2mg")).toBeVisible();
  expect(
    screen.getByLabelText("Tooltip for oral (mg) common"),
  ).toHaveTextContent("oral (mg): 1 - 2");
  expect(
    screen.getByLabelText("Tooltip for insufflated (mg) common"),
  ).toHaveTextContent("insufflated (mg): 3 - 4");
  expect(
    JSON.parse(screen.getByLabelText("Chart series").textContent ?? ""),
  ).toEqual([
    {
      name: "common",
      data: [
        { x: "oral (mg)", y: [1, 2] },
        { x: "insufflated (mg)", y: [3, 4] },
      ],
    },
  ]);
});

test("draws an open card's charts once, without animation", () => {
  mockChartRender.mockClear();
  const drugData = {
    ...drug,
    formatted_dose: { oral: { common: "1-2mg" } },
    formatted_duration: { oral: "1-2", _unit: "hours" as Unit },
  } as Drug;
  const { rerender } = render(<DrugInfo drugData={drugData} />);
  expect(mockChartRender).toHaveBeenCalledTimes(2);
  expect(mockChartRender.mock.calls).toEqual([
    [expect.objectContaining({ animations: { enabled: false } })],
    [expect.objectContaining({ animations: { enabled: false } })],
  ]);

  // The factsheets table re-renders the panel of an expanded row on every keystroke in a filter
  rerender(<DrugInfo drugData={drugData} />);
  expect(mockChartRender).toHaveBeenCalledTimes(2);
});

test("keeps unplottable doses in the table and hides the empty chart", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_dose: {
          oral: { light: "unknown", common: "3mg+", strong: "25-50ug/hr" },
        },
      }}
    />,
  );
  expect(screen.getByText("unknown")).toBeVisible();
  expect(screen.getByText("3mg+")).toBeVisible();
  expect(screen.getByText("25-50ug/hr")).toBeVisible();
  expect(screen.queryByLabelText("Chart series")).not.toBeInTheDocument();
  expect(screen.queryByText(/bounded mass ranges/)).not.toBeInTheDocument();
});

test("charts mixed mass units on one milligram scale", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_dose: {
          oral: { common: "800-1500ug" },
          insufflated: { common: "1-2mg" },
        },
      }}
    />,
  );
  expect(screen.getByText("800-1500ug")).toBeVisible();
  expect(screen.getByText(/bounded mass ranges in mg/)).toBeVisible();
  expect(
    JSON.parse(screen.getByLabelText("Chart series").textContent ?? ""),
  ).toEqual([
    {
      name: "common",
      data: [
        { x: "oral (mg)", y: [0.8, 1.5] },
        { x: "insufflated (mg)", y: [1, 2] },
      ],
    },
  ]);
});

test("converts onset to hours and offsets duration and after effects", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_onset: { oral: "15-30", _unit: "minutes" as Unit },
        formatted_duration: {
          oral: "1.5-2.5",
          insufflated: "2",
          _unit: "hours" as Unit,
        },
        formatted_aftereffects: { oral: "1-3", _unit: "hours" as Unit },
      }}
    />,
  );
  expect(screen.getByText("15m to 30m")).toBeVisible();
  expect(screen.getByText("1h 30m to 2h 30m")).toBeVisible();
  expect(screen.getByLabelText("Tooltip for oral Onset")).toHaveTextContent(
    /30m after dosing/,
  );
  expect(screen.getByLabelText("Tooltip for oral Duration")).toHaveTextContent(
    /Lasts 1h 30m\s*-\s*2h 30m after Onset ends/,
  );
  // insufflated has no onset, so its duration counts from dosing.
  expect(
    screen.getByLabelText("Tooltip for insufflated Duration"),
  ).toHaveTextContent(/Lasts 0\s*-\s*2h after dosing/);
  const series = JSON.parse(
    screen.getByLabelText("Chart series").textContent ?? "",
  );
  // One series per phase, so the legend lists each phase once.
  expect(series).toEqual([
    expect.objectContaining({
      name: "Onset",
      data: [expect.objectContaining({ x: "oral", y: [0, 0.5] })],
    }),
    expect.objectContaining({
      name: "Duration",
      data: [
        expect.objectContaining({ x: "oral", y: [0.25, 3] }),
        expect.objectContaining({ x: "insufflated", y: [0, 2] }),
      ],
    }),
    expect.objectContaining({
      name: "After Effects",
      data: [expect.objectContaining({ x: "oral", y: [1.75, 5.75] })],
    }),
  ]);
});

test("puts a route-less onset on every route the other phases name", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_onset: { value: "30", _unit: "minutes" as Unit },
        formatted_aftereffects: {
          oral: "not recorded",
          insufflated: "1-2",
          _unit: "hours" as Unit,
        },
      }}
    />,
  );
  expect(screen.getAllByText("0 to 30m")).toHaveLength(2);
  // oral's after effects don't parse, so only insufflated has that bar. With no duration
  // before it, it's timed from dosing.
  expect(
    JSON.parse(screen.getByLabelText("Chart series").textContent ?? ""),
  ).toEqual([
    expect.objectContaining({
      name: "Onset",
      data: [
        expect.objectContaining({ x: "oral", y: [0, 0.5] }),
        expect.objectContaining({ x: "insufflated", y: [0, 0.5] }),
      ],
    }),
    expect.objectContaining({
      name: "After Effects",
      data: [expect.objectContaining({ x: "insufflated", y: [0, 2] })],
    }),
  ]);
});

test("files timing under Oral when no phase names a route", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_onset: { value: "30-60", _unit: "minutes" as Unit },
        formatted_duration: { value: "4-6", _unit: "hours" as Unit },
      }}
    />,
  );
  expect(screen.getByText("Oral")).toBeVisible();
  expect(screen.getByText("4h to 6h")).toBeVisible();
  expect(screen.getByLabelText("Tooltip for Oral Duration")).toHaveTextContent(
    /Lasts 4h\s*-\s*6h after Onset ends/,
  );
});

// Shaped like DMT's data: routes that only some phases name, a route-less after effects
// value, and route keys with an underscore.
test("keeps every duration under its own heading when routes lack phases", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_onset: {
          insufflated: "3-5",
          oral: "20-45",
          _unit: "minutes" as Unit,
        },
        formatted_duration: {
          insufflated: "45-60",
          Oral_MAOI: "180-420",
          _unit: "minutes" as Unit,
        },
        formatted_aftereffects: { value: "15-60", _unit: "minutes" as Unit },
      }}
    />,
  );
  // The cells after a route's name, in heading order: Onset, Duration, After Effects.
  const rowCells = (route: string) => {
    const cells: string[] = [];
    let cell = screen.getByText(route).closest(".MuiGrid-root")
      ?.nextElementSibling as Element | null;
    for (let i = 0; i < 3 && cell; i += 1) {
      cells.push(cell.textContent ?? "");
      cell = cell.nextElementSibling;
    }
    return cells;
  };
  expect(rowCells("insufflated")).toEqual([
    "3m to 5m",
    "45m to 1h",
    "15m to 1h",
  ]);
  expect(rowCells("oral")).toEqual(["20m to 45m", "", "15m to 1h"]);
  expect(rowCells("Oral (MAOI)")).toEqual(["", "3h to 7h", "15m to 1h"]);
  expect(screen.queryByText(/Oral_MAOI/)).toBeNull();

  // Each route's after effects follow that route's own duration, or dosing without one.
  expect(
    screen.getByLabelText("Tooltip for insufflated After Effects"),
  ).toHaveTextContent(/after Duration ends/);
  expect(
    screen.getByLabelText("Tooltip for oral After Effects"),
  ).toHaveTextContent(/after dosing/);
  expect(screen.queryByLabelText("Tooltip for Oral (MAOI) Onset")).toBeNull();

  // With no onset, Oral (MAOI)'s 3-7h duration runs from dosing with its marker at 3h,
  // not from 3h with its marker at 6h.
  const durations = (
    JSON.parse(screen.getByLabelText("Chart series").textContent ?? "") as {
      name: string;
      data: { x: string; y: number[]; goals: { value: number }[] }[];
    }[]
  ).find(({ name }) => name === "Duration");
  const maoi = durations?.data.find(({ x }) => x === "Oral (MAOI)");
  expect(maoi?.y).toEqual([0, 7]);
  expect(maoi?.goals[0].value).toBe(3);
});

test("displays after effects without onset or duration data", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_aftereffects: { oral: "2-3", _unit: "hours" as Unit },
      }}
    />,
  );
  expect(screen.getByText("2h to 3h")).toBeVisible();
  expect(
    screen.getByLabelText("Tooltip for oral After Effects"),
  ).toHaveTextContent(/3h after dosing/);
  // From dosing to 3h, ending no sooner than 2h. It used to be drawn 2h-3h with its
  // marker at 4h, past the end of its own bar.
  expect(
    JSON.parse(screen.getByLabelText("Chart series").textContent ?? ""),
  ).toEqual([
    expect.objectContaining({
      name: "After Effects",
      data: [
        expect.objectContaining({
          x: "oral",
          y: [0, 3],
          goals: [expect.objectContaining({ value: 2 })],
        }),
      ],
    }),
  ]);
});

test("renders fractional hour durations without after effects", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        aliases: undefined,
        formatted_duration: { oral: "1.5-2.5", _unit: "hours" as Unit },
      }}
    />,
  );
  expect(screen.getByText("1h 30m to 2h 30m")).toBeVisible();
  expect(screen.queryByText("Aliases")).toBeNull();
});

test("renders optional references, warnings, and combination notes", () => {
  render(
    <DrugInfo
      drugData={
        {
          ...drug,
          categories: ["stimulant" as Category],
          properties: {
            summary: "Sample summary",
            warning: "Sample warning",
            experiences: "https://example.test/experiences",
          },
          combos: {
            absent: undefined,
            mdma: {
              status: "Caution",
              note: "Sample combination note (with an aside)",
            },
            alcohol: { status: "Dangerous" },
          } as Drug["combos"],
          formatted_effects: ["Sample effect"],
          links: {
            wiki: "https://example.test/wiki",
            experiences: "https://example.test/stories",
          },
          sources: { general: ["Sample source"] },
          pweffects: { Nausea: "example" },
        } as Drug
      }
    />,
  );
  expect(screen.getByText(/sample warning/i)).toBeVisible();
  expect(screen.getByText("Sample summary")).toBeVisible();
  expect(screen.getByText("MDMA")).toBeVisible();
  // Notes are shown as written, parentheses included.
  expect(
    screen.getByText("Sample combination note (with an aside)"),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: "tripsit.me/combo" }),
  ).toHaveAttribute("href", "/combo");
  expect(screen.getByText("Sample effect")).toBeVisible();
  expect(screen.getByText("Sample source")).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Erowid Experience Vault" }),
  ).toHaveAttribute("href", "https://example.test/experiences");
  expect(screen.getByRole("link", { name: "Nausea" })).toHaveAttribute(
    "href",
    "https://psychonautwiki.org/wiki/Nausea",
  );
});

// Shaped like DMT's: the first route has no Threshold, so it used to land after Strong.
// The real data capitalises its levels, unlike the Dosage type.
test("orders dose columns and chart series from weakest to strongest", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_dose: {
          insufflated: { Light: "10-25mg", Common: "25-50mg" },
          vapourized: {
            Common: "15-25mg",
            Heavy: "35mg+",
            Light: "10-15mg",
            Threshold: "5-10mg",
          },
        } as unknown as Dose,
      }}
    />,
  );
  const levels = ["Threshold", "Light", "Common", "Heavy"];
  const headings = levels.map((level) => screen.getByText(level));
  for (let i = 1; i < headings.length; i += 1) {
    expect(
      headings[i - 1].compareDocumentPosition(headings[i]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
  // The insufflated row has a dash under Threshold, then its own doses in order.
  const cells: string[] = [];
  let cell = screen.getByText("insufflated").closest(".MuiGrid-root")
    ?.nextElementSibling as Element | null;
  for (let i = 0; i < levels.length && cell; i += 1) {
    cells.push(cell.textContent ?? "");
    cell = cell.nextElementSibling;
  }
  expect(cells).toEqual(["-", "10-25mg", "25-50mg", "-"]);

  // 35mg+ has no upper bound, so Heavy isn't charted.
  const series = JSON.parse(
    screen.getByLabelText("Chart series").textContent ?? "",
  ) as { name: string }[];
  expect(series.map(({ name }) => name)).toEqual([
    "Threshold",
    "Light",
    "Common",
  ]);
  expect(
    JSON.parse(screen.getByLabelText("Chart colours").textContent ?? ""),
  ).toEqual(["#6DDF6D", "#A8E05F", "#FFD966"]);
  // Threshold's series lists vapourized first, but the rows keep the table's order.
  expect(
    JSON.parse(screen.getByLabelText("Chart rows").textContent ?? ""),
  ).toEqual(["insufflated (mg)", "vapourized (mg)"]);
});

// Shaped like LSA's: doses in seeds, which the mg chart can't show.
test("gives a chartless dosage table the whole card and readable route names", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_dose: {
          hbwr: { Light: "1-2seeds" },
          Morning_Glory: { Light: "50-100seeds" },
        } as unknown as Dose,
      }}
    />,
  );
  expect(screen.getByText("Morning Glory")).toBeVisible();
  expect(screen.queryByText("Morning_Glory")).toBeNull();
  expect(screen.queryByLabelText("Chart series")).not.toBeInTheDocument();
  const tableColumn = screen
    .getByText("Morning Glory")
    .closest(".MuiGrid-container")?.parentElement;
  expect(tableColumn).toHaveClass("MuiGrid-grid-xs-12");
  expect(tableColumn).not.toHaveClass("MuiGrid-grid-sm-6");
});

test("charts a dose range that ends with a full stop", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_dose: {
          oral: { Common: "50-100mg", Strong: "100-135mg." },
        } as unknown as Dose,
      }}
    />,
  );
  expect(screen.getByText("100-135mg.")).toBeVisible();
  expect(
    (
      JSON.parse(screen.getByLabelText("Chart series").textContent ?? "") as {
        name: string;
      }[]
    ).map(({ name }) => name),
  ).toEqual(["Common", "Strong"]);
});

test("keeps open-ended dose text without plotting an invented upper bound", () => {
  render(
    <DrugInfo
      drugData={{
        ...drug,
        formatted_dose: { oral: { common: "2+" } },
      }}
    />,
  );
  expect(screen.getByText("2+")).toBeVisible();
  expect(
    screen.queryByLabelText("Tooltip for oral (mg) common"),
  ).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Chart series")).not.toBeInTheDocument();
});

test("shows reagent test results with a colour guide", () => {
  render(
    <DrugInfo
      drugData={
        {
          ...drug,
          properties: {
            "test-kits": "Marquis: Yellow > Green. | Mecke: Brown.",
          },
        } as Drug
      }
    />,
  );
  expect(
    screen.getByRole("heading", { name: "Reagent test results" }),
  ).toBeVisible();
  expect(screen.queryByText("Test-kits")).toBeNull();
  const results = screen.getAllByRole("listitem");
  expect(results).toHaveLength(2);
  expect(results[0]).toHaveTextContent("Marquis: Yellow > Green");
  expect(results[1]).toHaveTextContent("Mecke: Brown");
});

test("shows each safety note once, under its own heading, before the other cards", () => {
  render(
    <DrugInfo
      drugData={
        {
          ...drug,
          properties: {
            contraindications: "Thyroid conditions",
            avoid: "Mixing with stimulants",
            warning: "Very long lasting",
            adverseEffects: "Vasoconstriction",
            risks: "  ",
          },
        } as unknown as Drug
      }
    />,
  );
  const headings = screen
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(headings.slice(0, 4)).toEqual([
    "Warning",
    "Avoid",
    "Contraindications",
    "Adverse effects",
  ]);
  expect(headings).not.toContain("Risks");
  expect(screen.getAllByText("Thyroid conditions")).toHaveLength(1);
  expect(screen.getByText("Very long lasting").tagName).toBe("P");
});

test("groups combinations by risk, hides empty groups and uses the checker's names", () => {
  render(
    <DrugInfo
      drugData={
        {
          ...drug,
          combos: {
            maois: { status: "Dangerous", note: "Serotonin  syndrome." },
            "5-meo-xxt": { status: "Caution" },
            pcp: { status: "Unsafe" },
            "nitrous oxide": { status: "Low Risk & Synergy" },
          } as Drug["combos"],
        } as Drug
      }
    />,
  );
  const groups = screen
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent?.replace(/^\S+\s/, ""));
  expect(groups).toEqual([
    "Dangerous (1)",
    "Unsafe (1)",
    "Caution (1)",
    "Low Risk & Synergy (1)",
  ]);
  expect(screen.getByText("MAOIs")).toBeVisible();
  expect(screen.getByText("5-MeO-xxT")).toBeVisible();
  expect(screen.getByText("PCP")).toBeVisible();
  expect(screen.getByText("Nitrous Oxide")).toBeVisible();
  expect(screen.getByText("Serotonin syndrome.")).toBeVisible();
});

test("links PsychonautWiki effects with valid, canonical URLs", () => {
  render(
    <DrugInfo
      drugData={
        {
          ...drug,
          pweffects: {
            "Restless leg syndrome": "x",
            "Visual disconnection#Structures": "x",
            "Déjà vu": "x",
          },
        } as Drug
      }
    />,
  );
  expect(
    screen.getByRole("link", { name: "Restless leg syndrome" }),
  ).toHaveAttribute(
    "href",
    "https://psychonautwiki.org/wiki/Restless_leg_syndrome",
  );
  // "#" is a section link on the page, not part of the page name.
  expect(
    screen.getByRole("link", { name: "Visual disconnection#Structures" }),
  ).toHaveAttribute(
    "href",
    "https://psychonautwiki.org/wiki/Visual_disconnection#Structures",
  );
  expect(screen.getByRole("link", { name: "Déjà vu" })).toHaveAttribute(
    "href",
    "https://psychonautwiki.org/wiki/D%C3%A9j%C3%A0_vu",
  );
});
