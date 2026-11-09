import { render, screen } from "@testing-library/react";
import type { AppProps } from "next/app";
import App from "@/pages/_app";
import { useDrugs } from "@/utils/drugs";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

function FactsheetNames() {
  const { data } = useDrugs();
  return <p>{data?.map((drug) => drug.pretty_name).join(", ")}</p>;
}

test("reuses the downloaded drug database across page changes", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      example: { name: "example", pretty_name: "Example compound" },
    }),
  });
  global.fetch = fetchMock;
  const first = {
    Component: FactsheetNames,
    pageProps: {},
    router: {} as AppProps["router"],
  };
  const second = {
    ...first,
    Component: () => (
      <main>
        <FactsheetNames />
      </main>
    ),
  };
  const { rerender } = render(<App {...first} />);
  expect(await screen.findByText("Example compound")).toBeVisible();

  rerender(<App {...second} />);
  expect(screen.getByRole("main")).toHaveTextContent("Example compound");
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
