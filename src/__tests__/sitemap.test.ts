/**
 * @jest-environment node
 */
import { DRUGS_URL } from "@/utils/drugs";
import { envOrDefault } from "@/utils/envOrDefault";
import robots from "@/app/robots";
import sitemap, { PAGES, revalidate } from "@/app/sitemap";

const origin = `https://${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;

test("rebuilds the sitemap once a day", () => {
  expect(revalidate).toBe(24 * 60 * 60);
});

describe("sitemap", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("lists the site's pages and a factsheet page for every drug", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        lsd: { name: "lsd" },
        "3,4-ctmp": { name: "3,4-ctmp" },
        "α-pbp": { name: "α-pbp" },
      }),
    });

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(global.fetch).toHaveBeenCalledWith(DRUGS_URL);
    expect(urls).toEqual([
      ...PAGES.map((path) => `${origin}${path}`),
      `${origin}/factsheets/lsd`,
      `${origin}/factsheets/3%2C4-ctmp`,
      `${origin}/factsheets/%CE%B1-pbp`,
    ]);
    expect(urls).toContain(`${origin}/combo`);
  });

  it("still lists the other pages when the drug list can't be loaded", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual(PAGES.map((path) => `${origin}${path}`));
    expect(consoleError).toHaveBeenCalled();
  });
});

describe("robots", () => {
  it("allows every crawler and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${origin}/sitemap.xml`,
    });
  });
});
