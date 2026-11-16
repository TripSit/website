import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Drug, Unit } from "tripsit_drug_db";
import FactsheetsPage from "@/pages/factsheets";
import DrugInfo from "../DrugInfo";

jest.mock("@heroui/react", () => ({ Accordion: () => null }));
// Records the size each chart is drawn at.
const mockChartSize = jest.fn();
jest.mock(
  "next/dynamic",
  () => () =>
    function Chart({
      width,
      height,
    }: {
      width: number | string;
      height: number | string;
    }) {
      mockChartSize({ width, height });
      return null;
    },
);

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test("draws the dose and duration charts at the width of their column", () => {
  render(
    <DrugInfo
      drugData={
        {
          name: "example",
          pretty_name: "Example compound",
          properties: {},
          formatted_dose: { oral: { common: "1-2mg" } },
          formatted_duration: { oral: "1-2", _unit: "hours" as Unit },
        } as Drug
      }
    />,
  );
  // A fixed 500px chart was cut off on a phone
  expect(mockChartSize.mock.calls).toEqual([
    [{ width: "100%", height: 200 }],
    [{ width: "100%", height: 200 }],
  ]);
});

test("lists Psychonaut Wiki effects in fewer columns on narrow screens", () => {
  render(
    <DrugInfo
      drugData={
        {
          name: "example",
          pretty_name: "Example compound",
          properties: {},
          pweffects: { "Acuity enhancement": "https://example.org" },
        } as unknown as Drug
      }
    />,
  );
  const item = screen
    .getByRole("link", { name: "Acuity enhancement" })
    .closest(".MuiGrid-root");
  // Two per row on a phone, three on a tablet, four on a desktop
  expect(item).toHaveClass(
    "MuiGrid-grid-xs-6",
    "MuiGrid-grid-sm-4",
    "MuiGrid-grid-md-3",
  );
});

test("keeps an expanded factsheet in view and every table button reachable", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      first: { name: "first", pretty_name: "First compound", properties: {} },
    }),
  });
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <FactsheetsPage />
    </QueryClientProvider>,
  );
  expect(await screen.findByText("First compound")).toBeVisible();
  for (const name of [
    "Show/Hide search",
    "Show/Hide filters",
    "Show/Hide columns",
    "Toggle density",
    "Toggle full screen",
  ]) {
    expect(screen.getByRole("button", { name })).toBeVisible();
  }

  fireEvent.click(screen.getByRole("button", { name: "Expand" }));
  // The panel spans every column; the card inside it sticks to the visible part of the table
  expect(await screen.findByTestId("factsheet-detail")).toHaveStyle({
    position: "sticky",
  });
});
