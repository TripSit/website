import type { GetServerSideProps } from "next";
import { fetchDrugs } from "../utils/drugs";
import { siteOrigin } from "../utils/siteOrigin";

// Pages for search engines. /appeal is left out because it only works after a login.
const PAGES = [
  "/",
  "/factsheets",
  "/combo",
  "/benzos",
  "/dxm",
  "/volume",
  "/rules",
  "/terms",
  "/webchat",
  "/reflect",
  "/reflect/privacy",
  "/reflect/terms",
];

// The drug database is one 1.6 MB file, so its factsheet list is kept for an hour rather
// than downloaded for every request. A drug added to the database appears within the hour.
const CACHE_MS = 60 * 60 * 1000;
let cached: { expires: number; paths: string[] } | undefined;

async function sitemapPaths(): Promise<string[]> {
  if (cached && cached.expires > Date.now()) {
    return cached.paths;
  }
  try {
    const factsheets = (await fetchDrugs()).map(
      (drug) => `/factsheets/${encodeURIComponent(drug.name)}`,
    );
    cached = {
      expires: Date.now() + CACHE_MS,
      paths: [...PAGES, ...factsheets],
    };
    return cached.paths;
  } catch (error) {
    // List the other pages rather than fail; the next request tries the download again.
    console.error("Sitemap: could not load the drug list.", error);
    return PAGES;
  }
}

// Served at /sitemap.xml. Paths are URL-encoded, so they need no XML escaping.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = (await sitemapPaths())
    .map((path) => `  <url><loc>${siteOrigin}${path}</loc></url>`)
    .join("\n");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  return { props: {} };
};

// getServerSideProps has already written the response, so there is nothing to render.
export default function Sitemap() {
  return null;
}
