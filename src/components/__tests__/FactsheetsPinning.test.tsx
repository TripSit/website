import { fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FactsheetsPage from "@/pages/factsheets";

jest.mock("@heroui/react", () => ({ Accordion: () => null }));
// "unlisted" is not in the database: pins for drugs that aren't loaded must be ignored,
// not crash the table (as the commented-out rowPinning in #78 did).
jest.mock("@/assets/pinnedDrugs.json", () => ["minimal", "unlisted"]);

const drugs = {
  example: { name: "example", pretty_name: "Example compound", properties: {} },
  minimal: { name: "minimal", pretty_name: "Minimal compound", properties: {} },
};
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => drugs });
});
afterEach(() => {
  global.fetch = originalFetch;
});

function bodyNames() {
  return screen
    .getAllByRole("row")
    .map((row) => within(row).queryByRole("link")?.textContent)
    .filter(Boolean);
}

test("starts the listed drugs pinned to the top, and lets visitors unpin them", async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <FactsheetsPage />
    </QueryClientProvider>,
  );
  await screen.findByRole("link", { name: "Example compound" });
  expect(bodyNames()).toEqual(["Minimal compound", "Example compound"]);
  // The row's pin toggle (labelled "Pin" in both states) unpins it.
  const minimalRow = screen
    .getAllByRole("row")
    .find((row) =>
      within(row).queryByRole("link", { name: "Minimal compound" }),
    ) as HTMLElement;
  fireEvent.click(within(minimalRow).getByRole("button", { name: "Pin" }));
  expect(bodyNames()).toEqual(["Example compound", "Minimal compound"]);
});
