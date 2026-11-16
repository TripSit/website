import type { MetadataRoute } from "next";
import { envOrDefault } from "../utils/envOrDefault";

const origin = `https://${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;

// Served at /robots.txt: lets every crawler in and points them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  };
}
