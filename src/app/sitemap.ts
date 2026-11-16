import type { MetadataRoute } from "next";
import { fetchDrugs } from "../utils/drugs";
import { envOrDefault } from "../utils/envOrDefault";

const origin = `https://${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;

// Served at /sitemap.xml. Next builds it once and rebuilds it at most once a day, so a drug
// added to the database reaches the sitemap without a deploy.
export const revalidate = 86400;

// Pages for search engines. /appeal is left out because it only works after a login.
export const PAGES = [
  "/",
  "/factsheets",
  "/combo",
  "/webchat",
  "/reflect",
  "/reflect/privacy",
  "/reflect/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let factsheets: string[] = [];
  try {
    factsheets = (await fetchDrugs()).map(
      (drug) => `/factsheets/${encodeURIComponent(drug.name)}`,
    );
  } catch (error) {
    // Still list the other pages, rather than failing the build or the request.
    console.error("Sitemap: could not load the drug list.", error);
  }
  return [...PAGES, ...factsheets].map((path) => ({ url: `${origin}${path}` }));
}
