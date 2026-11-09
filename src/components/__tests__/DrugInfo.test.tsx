import { render, screen } from "@testing-library/react";
import type { Category, Drug, Unit } from "tripsit_drug_db";
import DrugPage from "@/pages/factsheets/[drug]";
import { useRouter } from "next/router";
import { useDrugs } from "@/utils/drugs";
import DrugInfo from "../DrugInfo";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("@/utils/drugs", () => ({ useDrugs: jest.fn() }));
jest.mock("../Header", () => () => null);
jest.mock(
  "next/dynamic",
  () => () =>
    function Chart({
      series,
      options,
    }: {
      series: unknown;
      options: {
        tooltip: {
          custom: (input: {
            seriesIndex: number;
            dataPointIndex: number;
            w: { config: { series: unknown } };
          }) => string;
        };
      };
    }) {
      return (
        <>
          <output aria-label="Chart series">{JSON.stringify(series)}</output>
          {Array.isArray(series) &&
            series.map(({ name }, seriesIndex) => {
              const html = options.tooltip.custom({
                seriesIndex,
                dataPointIndex: 0,
                w: { config: { series } },
              });
              return (
                <output key={seriesIndex} aria-label={`Tooltip for ${name}`}>
                  {
                    new DOMParser().parseFromString(html, "text/html").body
                      .textContent
                  }
                </output>
              );
            })}
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

test.each(["EXAMPLE", "example compound", "ALIAS"])(
  "looks up a factsheet by %s",
  (name) => {
    jest
      .mocked(useRouter)
      .mockReturnValue({ query: { drug: name } } as unknown as ReturnType<
        typeof useRouter
      >);
    jest
      .mocked(useDrugs)
      .mockReturnValue({ data: [drug] } as ReturnType<typeof useDrugs>);
    render(<DrugPage />);
    expect(screen.getByText("Example compound")).toBeVisible();
  },
);

test.each([
  { name: undefined },
  { name: ["example", "alias"] },
  { name: "missing" },
])("shows the missing factsheet view for $name", ({ name }) => {
  jest
    .mocked(useRouter)
    .mockReturnValue({ query: { drug: name } } as unknown as ReturnType<
      typeof useRouter
    >);
  jest
    .mocked(useDrugs)
    .mockReturnValue({ data: [drug] } as ReturnType<typeof useDrugs>);
  render(<DrugPage />);
  expect(
    screen.getByRole("heading", { name: /drug not found/i }),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: /contact us on discord/i }),
  ).toBeVisible();
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
  expect(screen.getByLabelText("Tooltip for common")).toHaveTextContent(
    /oral .*:.*1 - 2/,
  );
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

test("keeps unplottable doses in the table", () => {
  render(
    <DrugInfo
      drugData={{ ...drug, formatted_dose: { oral: { light: "unknown" } } }}
    />,
  );
  expect(screen.getByText("unknown")).toBeVisible();
  expect(screen.getByLabelText("Chart series")).toHaveTextContent("[]");
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
  expect(screen.getByLabelText("Tooltip for Onset")).toHaveTextContent(
    /30m after dosing/,
  );
  expect(screen.getAllByLabelText("Tooltip for Duration")[0]).toHaveTextContent(
    /after Onset ends/,
  );
  const series = JSON.parse(
    screen.getByLabelText("Chart series").textContent ?? "",
  );
  expect(series).toEqual([
    expect.objectContaining({
      name: "Onset",
      data: [expect.objectContaining({ x: "oral", y: [0, 0.5] })],
    }),
    expect.objectContaining({
      name: "Duration",
      data: [expect.objectContaining({ x: "oral", y: [0.25, 3] })],
    }),
    expect.objectContaining({
      name: "After Effects",
      data: [expect.objectContaining({ x: "oral", y: [1.75, 5.75] })],
    }),
    expect.objectContaining({
      name: "Duration",
      data: [expect.objectContaining({ x: "insufflated", y: [0, 2] })],
    }),
  ]);
});

test("supports legacy oral onset and routes with after effects only", () => {
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
  expect(screen.getByText("0 to 30m")).toBeVisible();
  expect(
    JSON.parse(screen.getByLabelText("Chart series").textContent ?? ""),
  ).toEqual([
    expect.objectContaining({
      name: "Onset",
      data: [expect.objectContaining({ x: "Oral", y: [0, 0.5] })],
    }),
    expect.objectContaining({
      name: "After Effects",
      data: [expect.objectContaining({ x: "insufflated", y: [1, 2] })],
    }),
  ]);
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
  expect(screen.getByText("2 to 3")).toBeVisible();
  expect(screen.getByLabelText("Tooltip for After Effects")).toHaveTextContent(
    /3h after dosing/,
  );
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
            mdma: { status: "Caution", note: "(Sample combination note)" },
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
  expect(screen.getByText("Sample combination note")).toBeVisible();
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
