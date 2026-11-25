/**
 * @jest-environment node
 */
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import blogPaths from "@/assets/blogPaths.json";
import { envOrDefault } from "@/utils/envOrDefault";
import nextConfig from "../../next.config.js";

const blogOrigin = `https://updates.${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;
const repoRoot = path.join(__dirname, "../..");

// First URL segment of everything this site serves: pages, app routes and public files.
// Route groups like "(marketing)" add no segment, so their children count as top level.
function siteSegments(dir: string): string[] {
  if (!existsSync(path.join(repoRoot, dir))) {
    return [];
  }
  return readdirSync(path.join(repoRoot, dir), { withFileTypes: true }).flatMap(
    (entry) => {
      if (entry.isDirectory() && entry.name.startsWith("(")) {
        return siteSegments(path.join(dir, entry.name));
      }
      return [entry.name.replace(/\.[^.]+$/, "")];
    },
  );
}

async function redirects() {
  return (await nextConfig.redirects?.()) ?? [];
}

describe("blog redirects", () => {
  it("permanently redirects the old privacy URL directly to the TripBot policy", async () => {
    expect(await redirects()).toContainEqual({
      source: "/privacy",
      destination: "/tripbot/privacy",
      permanent: true,
    });
    expect(
      (await redirects()).some(({ source }) => source.startsWith("/tripbot")),
    ).toBe(false);
  });
  it("sends legacy homepage addresses to the canonical homepage", async () => {
    expect(await redirects()).toEqual(
      expect.arrayContaining([
        { source: "/index.html", destination: "/", permanent: true },
        { source: "/index.php", destination: "/", permanent: true },
      ]),
    );
  });
  it("sends every blog path, and anything under it, to the same place on the blog", async () => {
    expect(await redirects()).toEqual(
      expect.arrayContaining(
        blogPaths.map((blogPath) => ({
          source: `${blogPath}/:rest*`,
          destination: `${blogOrigin}${blogPath}/:rest*/`,
          permanent: true,
        })),
      ),
    );
  });

  it("sends the feeds, front-page pages and old image links to the blog", async () => {
    expect(await redirects()).toEqual(
      expect.arrayContaining([
        {
          source: "/feed/:rest*",
          destination: `${blogOrigin}/feed/:rest*/`,
          permanent: true,
        },
        {
          source: "/comments/:rest+",
          destination: `${blogOrigin}/comments/:rest+/`,
          permanent: true,
        },
        {
          source: "/page/:rest+",
          destination: `${blogOrigin}/page/:rest+/`,
          permanent: true,
        },
        {
          source: "/wp-content/:path*",
          destination: `${blogOrigin}/wp-content/:path*`,
          permanent: true,
        },
      ]),
    );
    expect(await redirects()).toHaveLength(blogPaths.length + 7);
  });

  it("lists each path once, as plain slugs with no pattern syntax", () => {
    expect(new Set(blogPaths).size).toBe(blogPaths.length);
    for (const blogPath of blogPaths) {
      expect(blogPath).toMatch(/^(\/[a-z0-9-]+)+$/);
    }
  });

  it("never shadows a page or file on this site", async () => {
    const served = new Set([
      ...siteSegments("src/pages"),
      ...siteSegments("src/app"),
      ...siteSegments("public"),
    ]);
    const clashes = (await redirects())
      .map(({ source }) => source)
      .filter((source) => served.has(source.split("/")[1]));

    expect(served).toContain("factsheets");
    expect(clashes).toEqual([]);
  });
});
