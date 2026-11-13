import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Drug } from "tripsit_drug_db";
import FactsheetsPage from "@/pages/factsheets";

jest.mock("@heroui/react", () => ({ Accordion: () => null }));
const mockDrugInfoCard = jest.fn(({ drugData }: { drugData: Drug }) => (
  <p>Details for {drugData.pretty_name}</p>
));
jest.mock("../DrugInfo", () => ({
  __esModule: true,
  default: (props: { drugData: Drug }) => mockDrugInfoCard(props),
}));

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test("builds a factsheet card only for the expanded row", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      first: { name: "first", pretty_name: "First compound", properties: {} },
      second: {
        name: "second",
        pretty_name: "Second compound",
        properties: {},
      },
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
  expect(await screen.findByText("Second compound")).toBeVisible();
  // The table asks for every row's detail panel on each render; collapsed rows must not build one
  expect(mockDrugInfoCard).not.toHaveBeenCalled();

  fireEvent.click(screen.getAllByRole("button", { name: "Expand" })[1]);
  expect(await screen.findByText("Details for Second compound")).toBeVisible();
  expect(
    new Set(mockDrugInfoCard.mock.calls.map(([props]) => props.drugData.name)),
  ).toEqual(new Set(["second"]));
});
