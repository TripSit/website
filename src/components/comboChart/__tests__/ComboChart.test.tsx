import { act, fireEvent, render, screen } from "@testing-library/react";
import ComboChart from "../ComboChart";
import {
  chartPath,
  drugLabel,
  isChartLanguage,
  LANGUAGES,
  riskLabel,
  TRANSLATIONS,
} from "../translations";
import { getCombo, SUBSTANCES } from "../../comboChecker/comboData";
import { pairPath } from "../../comboChecker/comboLinks";
import type { ChartLanguage, ChartTranslation } from "../translations";
import {
  getStaticPaths,
  getStaticProps,
} from "../../../pages/combo/chart/[lang]";
import { getStaticProps as englishProps } from "../../../pages/combo/chart";

const push = jest.fn();
const mockDownloadChart = jest.fn().mockResolvedValue(undefined);
jest.mock("../exportChart", () => ({
  downloadChart: (...args: unknown[]) => mockDownloadChart(...args),
}));
jest.mock("next/router", () => ({ useRouter: () => ({ push }) }));
jest.mock("../../Head", () => () => null);
jest.mock("next/head", () => () => null);

const props = {
  language: "en" as const,
  digest: "a".repeat(64),
  downloads: null,
  audit: { pairs: 300, unknown: 0, conflicts: 0 },
};

it.each(Object.keys(LANGUAGES) as ChartLanguage[])(
  "renders every pair with the checker's rating in %s",
  (language) => {
    const { container } = render(<ComboChart {...props} language={language} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      TRANSLATIONS[language].title.trim(),
    );
    expect(screen.getByRole("main")).toHaveAttribute("lang", language);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(25);
    const cells =
      container.querySelectorAll<HTMLTableCellElement>("[data-pair]");
    expect(cells).toHaveLength(600);
    cells.forEach((cell) => {
      const [a, b] = (cell.dataset.pair ?? "").split("|");
      expect(cell.dataset.risk).toBe(getCombo(a, b).risk);
      // Both halves of the chart open the same page for a pair.
      expect(cell.querySelector("a")).toHaveAttribute("href", pairPath(a, b));
    });
    SUBSTANCES.forEach((substance) =>
      expect(
        screen.getAllByRole("columnheader", {
          name: drugLabel(TRANSLATIONS[language], substance),
        }),
      ).toHaveLength(1),
    );
    TRANSLATIONS[language].disclaimer.forEach((paragraph) =>
      expect(screen.getByText(paragraph)).toBeVisible(),
    );
  },
);

it("switches to a permanent translated URL and exposes the generated downloads", () => {
  render(
    <ComboChart
      {...props}
      downloads={{ png: "/chart.png", pdf: "/chart.pdf" }}
    />,
  );
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "de" } });
  expect(push).toHaveBeenCalledWith("/combo/chart/de");
  expect(screen.getByRole("link", { name: /PNG/ })).toHaveAttribute(
    "href",
    "/chart.png",
  );
  expect(screen.getByRole("link", { name: /PDF/ })).toHaveAttribute("download");
});

it("exports the chosen substances, dimensions, and language and reports errors", async () => {
  render(<ComboChart {...props} language="de" />);
  fireEvent.click(screen.getByText(/Substances \(/));
  fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
  expect(screen.getByRole("button", { name: "Generate PNG" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: "LSD" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Alkohol" }));
  expect(document.querySelectorAll("[data-pair]")).toHaveLength(2);
  fireEvent.change(screen.getByLabelText("Width (pixels)"), {
    target: { value: "1600" },
  });
  fireEvent.change(screen.getByLabelText("Height (pixels)"), {
    target: { value: "900" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Generate PNG" }));
  expect(
    await screen.findByText("PNG ready. Your download has started."),
  ).toBeVisible();
  expect(mockDownloadChart).toHaveBeenLastCalledWith(
    { selected: ["LSD", "Alcohol"], language: "de", width: 1600, height: 900 },
    "png",
  );
  mockDownloadChart.mockRejectedValueOnce(new Error("Image encoding failed"));
  fireEvent.click(screen.getByRole("button", { name: "Generate PDF" }));
  expect(await screen.findByText("Image encoding failed")).toBeVisible();
  expect(screen.getByRole("button", { name: "Generate PDF" })).toBeEnabled();
  fireEvent.change(screen.getByLabelText("Width (pixels)"), {
    target: { value: "0" },
  });
  expect(screen.getByRole("button", { name: "Generate PNG" })).toBeDisabled();
  expect(screen.getByRole("alert")).toHaveTextContent(/whole numbers/);
});

it("falls back to English when a translation is incomplete", () => {
  const empty: ChartTranslation = {
    title: "",
    app: "",
    support: "",
    drugs: {},
    interactions: {},
    disclaimer: [],
  };
  expect(drugLabel(empty, "Benzodiazepines")).toBe("Benzos");
  expect(drugLabel(empty, "Unlisted")).toBe("Unlisted");
  expect(riskLabel(empty, "dangerous")).toBe("Dangerous");
  expect(riskLabel(empty, "unknown")).toBe("Unknown");
  expect(isChartLanguage("toString")).toBe(false);
});

it("prerenders supported languages, rejects others, and canonicalizes English", () => {
  expect(getStaticPaths()).toEqual({
    paths: Object.keys(LANGUAGES)
      .filter((lang) => lang !== "en")
      .map((lang) => ({ params: { lang } })),
    fallback: false,
  });
  expect(getStaticProps({ params: { lang: "xx" } })).toEqual({
    notFound: true,
  });
  expect(getStaticProps({ params: { lang: "en" } })).toEqual({
    notFound: true,
  });
  expect(chartPath("en")).toBe("/combo/chart");
  expect(getStaticProps({ params: { lang: "de" } })).toMatchObject({
    props: { language: "de" },
  });
  expect(englishProps()).toMatchObject({ props: { language: "en" } });
});

it("prints only the poster, sized to fit one page", () => {
  let pageRule = "";
  const print = jest.fn(() => {
    pageRule = document.head.querySelector("style")?.textContent ?? "";
  });
  globalThis.print = print;
  render(<ComboChart {...props} />);
  fireEvent.click(screen.getByRole("button", { name: "Print" }));
  expect(print).toHaveBeenCalledTimes(1);
  expect(pageRule).toMatch(/^@page \{ size: \d+px \d+px; margin: 0; \}$/);
  expect(document.head.querySelector("style")).toBeNull();
});

it("switches between fitting the screen and actual size", () => {
  const { container } = render(<ComboChart {...props} />);
  const poster = container.querySelector<HTMLElement>("[data-combo-chart]");
  fireEvent.click(screen.getByRole("button", { name: "Actual size" }));
  expect(poster?.style.zoom).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Fit to width" }));
  expect(screen.getByRole("button", { name: "Actual size" })).toBeVisible();
});

it("narrows the chart to the substances left selected", () => {
  render(<ComboChart {...props} />);
  fireEvent.click(screen.getByText(/Substances \(/));
  fireEvent.click(screen.getByRole("checkbox", { name: "LSD" }));
  expect(screen.getByText(/Substances \(24 of 25/)).toBeVisible();
  expect(document.querySelectorAll("[data-pair]")).toHaveLength(552);
  fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
  expect(screen.getByRole("button", { name: "Print" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Select all" }));
  expect(document.querySelectorAll("[data-pair]")).toHaveLength(600);
});

it("fits the poster to the space the page gives it", () => {
  const disconnect = jest.fn();
  let report: (
    entries: { contentRect: { width: number } }[],
  ) => void = () => {};
  globalThis.ResizeObserver = class {
    constructor(callback: typeof report) {
      report = callback;
    }
    observe() {}
    disconnect = disconnect;
  } as unknown as typeof ResizeObserver;
  const { container, unmount } = render(<ComboChart {...props} />);
  const poster = container.querySelector<HTMLElement>("[data-combo-chart]");
  // Hidden by CSS until it's measured, so it doesn't show at full size and then shrink.
  expect(poster).toHaveAttribute("data-unmeasured");
  act(() => report([{ contentRect: { width: 1955 } }]));
  expect(Number(poster?.style.zoom)).toBeCloseTo(0.5, 1);
  expect(poster).not.toHaveAttribute("data-unmeasured");
  unmount();
  expect(disconnect).toHaveBeenCalled();
  delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
});

it("explains a failed export that threw something other than an Error", async () => {
  mockDownloadChart.mockRejectedValueOnce("canvas lost");
  render(<ComboChart {...props} />);
  fireEvent.click(screen.getByRole("button", { name: "Generate PNG" }));
  expect(
    await screen.findByText(
      "Could not generate the chart. Please try smaller dimensions.",
    ),
  ).toBeVisible();
});
