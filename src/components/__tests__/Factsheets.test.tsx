import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FactsheetsPage from "@/pages/factsheets";

jest.mock("@heroui/react", () => ({ Accordion: () => null }));

const originalFetch = global.fetch;
const fetchMock = jest.fn();
const drugs = {
  example: {
    name: "example",
    pretty_name: "Example compound",
    aliases: ["Test alias"],
    properties: {
      summary: "Example summary",
      categories: ["Stimulant", "tentative", "supplement"],
    },
  },
  minimal: { name: "minimal", pretty_name: "Minimal compound", properties: {} },
};

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

function renderFactsheets() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FactsheetsPage />
    </QueryClientProvider>,
  );
}

test("loads factsheet rows from the drug database and expands their details", async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => drugs });
  renderFactsheets();
  expect(await screen.findByText("Example compound")).toBeVisible();
  expect(screen.getByText("Test alias")).toBeVisible();
  expect(screen.getByText("Minimal compound")).toBeVisible();
  expect(screen.getByText("Stimulant,")).toHaveStyle({
    color: "rgb(255, 255, 255)",
  });
  expect(screen.getByText("tentative,")).toHaveStyle({ color: "#001713" });
  expect(screen.getByText(/supplement/)).toBeVisible();
  fireEvent.click(screen.getAllByRole("button", { name: "Expand" })[0]);
  expect(await screen.findByText("Chemical Name")).toBeVisible();
});

test("shows a loading error and recovers when refreshed", async () => {
  fetchMock
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({ ok: true, json: async () => drugs });
  renderFactsheets();
  expect(await screen.findByText("Error loading data")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Refresh Data" }));
  expect(await screen.findByText("Example compound")).toBeVisible();
  expect(screen.queryByText("Error loading data")).toBeNull();
});
