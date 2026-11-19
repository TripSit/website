import { render, screen } from "@testing-library/react";
import type { Drug } from "tripsit_drug_db";
import { fetchDrugs } from "@/utils/drugs";
import DrugPage from "@/pages/factsheets/[drug]";

jest.mock("@/utils/drugs", () => ({ fetchDrugs: jest.fn() }));
jest.mock(
  "../Header",
  () =>
    function Header() {
      return <nav aria-label="Site header" />;
    },
);
jest.mock(
  "../DrugInfo",
  () =>
    function DrugInfo({ drugData }: { drugData: Drug }) {
      return <h1>{drugData.pretty_name}</h1>;
    },
);

const drug = {
  name: "example",
  pretty_name: "Example Compound",
  aliases: ["Alias-1"],
} as Drug;
const other = { name: "other", pretty_name: "Other" } as Drug;

// The page keeps its download in a module variable, so each test loads a fresh copy.
type Page = typeof import("@/pages/factsheets/[drug]");

function loadPage(): Page {
  let page = {} as Page;
  jest.isolateModules(() => {
    page = jest.requireActual("@/pages/factsheets/[drug]");
  });
  return page;
}

async function propsFor(
  page: ReturnType<typeof loadPage>,
  name: string | undefined,
) {
  return page.getStaticProps({ params: name ? { drug: name } : undefined });
}

beforeEach(() => {
  jest.mocked(fetchDrugs).mockReset().mockResolvedValue([other, drug]);
});

afterEach(() => jest.restoreAllMocks());

test("builds factsheets on first request instead of at build time", async () => {
  await expect(loadPage().getStaticPaths({})).resolves.toEqual({
    paths: [],
    fallback: "blocking",
  });
});

test.each(["example"])(
  "serves the canonical factsheet for %s",
  async (name) => {
    const page = loadPage();
    await expect(propsFor(page, name)).resolves.toEqual({
      props: { drugData: drug },
      revalidate: page.REVALIDATE_SECONDS,
    });
  },
);

test.each(["EXAMPLE", "example compound", "alias-1", "ALIAS-1"])(
  "permanently redirects %s to the database name",
  async (name) => {
    const page = loadPage();
    await expect(propsFor(page, name)).resolves.toEqual({
      redirect: { destination: "/factsheets/example", permanent: true },
      revalidate: page.REVALIDATE_SECONDS,
    });
  },
);

test("prefers database names over another drug's alias", async () => {
  jest
    .mocked(fetchDrugs)
    .mockResolvedValue([{ ...other, aliases: ["example"] }, drug]);
  await expect(propsFor(loadPage(), "example")).resolves.toHaveProperty(
    "props.drugData.name",
    "example",
  );
});

test("URL-encodes the redirect destination", async () => {
  jest.mocked(fetchDrugs).mockResolvedValue([{ ...drug, name: "α-pbp" }]);
  await expect(propsFor(loadPage(), "Alias-1")).resolves.toHaveProperty(
    "redirect.destination",
    "/factsheets/%CE%B1-pbp",
  );
});

test.each(["missing", undefined])(
  "returns a 404 for an unknown drug (%s)",
  async (name) => {
    const page = loadPage();
    await expect(propsFor(page, name)).resolves.toEqual({
      notFound: true,
      revalidate: page.REVALIDATE_SECONDS,
    });
  },
);

test("rebuilds each factsheet at most once an hour", () => {
  expect(loadPage().REVALIDATE_SECONDS).toBe(3600);
});

test("shares one download between factsheets until it is an hour old", async () => {
  const now = jest.spyOn(Date, "now").mockReturnValue(0);
  const page = loadPage();

  await propsFor(page, "example");
  await propsFor(page, "other");
  expect(fetchDrugs).toHaveBeenCalledTimes(1);

  now.mockReturnValue(page.REVALIDATE_SECONDS * 1000);
  await propsFor(page, "example");
  expect(fetchDrugs).toHaveBeenCalledTimes(2);
});

test("downloads again after a failed download", async () => {
  jest.mocked(fetchDrugs).mockRejectedValueOnce(new Error("HTTP 503"));
  const page = loadPage();

  await expect(propsFor(page, "example")).rejects.toThrow("HTTP 503");
  await expect(propsFor(page, "example")).resolves.toHaveProperty("props");
  expect(fetchDrugs).toHaveBeenCalledTimes(2);
});

test("keeps a newer download when an older one fails", async () => {
  const now = jest.spyOn(Date, "now").mockReturnValue(0);
  let failOld: (error: Error) => void = () => {};
  jest.mocked(fetchDrugs).mockReturnValueOnce(
    new Promise((_, reject) => {
      failOld = reject;
    }),
  );
  const page = loadPage();
  const oldRequest = propsFor(page, "example");

  now.mockReturnValue(page.REVALIDATE_SECONDS * 1000);
  await propsFor(page, "example");
  failOld(new Error("HTTP 503"));
  await expect(oldRequest).rejects.toThrow("HTTP 503");

  await propsFor(page, "other");
  expect(fetchDrugs).toHaveBeenCalledTimes(2);
});

test("renders the site header and the factsheet", () => {
  render(<DrugPage drugData={drug} />);

  expect(screen.getByRole("navigation", { name: "Site header" })).toBeVisible();
  expect(
    screen.getAllByRole("heading", { level: 1, name: "Example Compound" }),
  ).not.toHaveLength(0);
  expect(
    screen.getByRole("link", { name: "← All factsheets" }),
  ).toHaveAttribute("href", "/factsheets");
  expect(screen.getByRole("contentinfo")).toBeVisible();
});
