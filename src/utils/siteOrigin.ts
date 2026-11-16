import { envOrDefault } from "./envOrDefault";

// The site's public address, for canonical links, social previews and the sitemap.
// Uses tripsit.me unless NEXT_PUBLIC_DNS_DOMAIN is set at build time.
export const siteOrigin = `https://${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;
