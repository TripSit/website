/**
 * @jest-environment node
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import type { GetServerSidePropsContext } from "next";
import { fetchDrugs } from "@/utils/drugs";
import { envOrDefault } from "@/utils/envOrDefault";

jest.mock("@/utils/drugs", () => ({
  ...jest.requireActual("@/utils/drugs"),
  fetchDrugs: jest.fn(),
}));

const origin = `https://${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;
const PAGES = [
  "/",
  "/factsheets",
  "/combo",
  "/benzos",
  "/dxm",
  "/volume",
  "/webchat",
  "/reflect",
  "/reflect/privacy",
  "/reflect/terms",
];

type SitemapPage = typeof import("@/pages/sitemap.xml");

// The page keeps its drug list in a module variable, so each test loads a fresh copy.
function loadPage(): SitemapPage {
  let page = {} as SitemapPage;
  jest.isolateModules(() => {
    page = jest.requireActual("@/pages/sitemap.xml");
  });
  return page;
}

async function request(page: SitemapPage) {
  const res = { setHeader: jest.fn(), end: jest.fn() };
  const result = await page.getServerSideProps({
    res,
  } as unknown as GetServerSidePropsContext);
  const xml: string = res.end.mock.calls[0][0];
  return {
    result,
    headers: Object.fromEntries(res.setHeader.mock.calls),
    xml,
    urls: [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, url]) => url),
  };
}

beforeEach(() => {
  jest
    .mocked(fetchDrugs)
    .mockReset()
    .mockResolvedValue([
      { name: "lsd" },
      { name: "3,4-ctmp" },
      { name: "α-pbp" },
    ] as Awaited<ReturnType<typeof fetchDrugs>>);
});

afterEach(() => jest.restoreAllMocks());

describe("sitemap.xml", () => {
  it("lists the site's pages and a factsheet page for every drug", async () => {
    const { result, headers, xml, urls } = await request(loadPage());

    expect(result).toEqual({ props: {} });
    expect(headers["Content-Type"]).toBe("application/xml; charset=utf-8");
    expect(xml).toMatch(
      /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">\n/,
    );
    expect(urls).toEqual([
      ...PAGES.map((page) => `${origin}${page}`),
      `${origin}/factsheets/lsd`,
      `${origin}/factsheets/3%2C4-ctmp`,
      `${origin}/factsheets/%CE%B1-pbp`,
    ]);
  });

  it("reuses the drug list for an hour", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(0);
    const page = loadPage();

    await request(page);
    now.mockReturnValue(60 * 60 * 1000 - 1);
    await request(page);
    expect(fetchDrugs).toHaveBeenCalledTimes(1);

    now.mockReturnValue(60 * 60 * 1000);
    await request(page);
    expect(fetchDrugs).toHaveBeenCalledTimes(2);
  });

  it("still lists the other pages when the drug list can't be loaded, and retries", async () => {
    jest.mocked(fetchDrugs).mockRejectedValueOnce(new Error("HTTP 503"));
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const page = loadPage();

    expect((await request(page)).urls).toEqual(
      PAGES.map((page) => `${origin}${page}`),
    );
    expect(consoleError).toHaveBeenCalled();
    expect((await request(page)).urls).toContain(`${origin}/factsheets/lsd`);
    expect(fetchDrugs).toHaveBeenCalledTimes(2);
  });

  it("renders nothing itself, since the response is already written", () => {
    expect(loadPage().default()).toBeNull();
  });
});

describe("robots.txt", () => {
  it("lets every crawler in and points to the sitemap", () => {
    const robots = readFileSync(
      path.join(__dirname, "../../public/robots.txt"),
      "utf8",
    );
    expect(robots).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://tripsit.me/sitemap.xml\n",
    );
  });
});
