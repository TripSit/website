import NextHead from "next/head";
import { siteOrigin } from "../utils/siteOrigin";

export const DEFAULT_TITLE = "TripSit - Harm Reduction Through Education";
export const DEFAULT_DESCRIPTION =
  "TripSit is a volunteer-run harm reduction community: a 24/7 live chat for on-the-spot help, drug factsheets, a drug combination checker and more.";

// Search results and link previews cut descriptions off at about 160 characters, so a
// longer text (a drug's summary, say) is shortened at a word boundary.
const MAX_DESCRIPTION = 160;

export function shortDescription(text: string): string {
  const flat = text.replaceAll(/\s+/g, " ").trim();
  if (flat.length <= MAX_DESCRIPTION) {
    return flat;
  }
  const cut = flat.slice(0, MAX_DESCRIPTION - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

type Props = Readonly<{
  title?: string;
  description?: string;
  // The page's path, such as "/factsheets". Left out on pages that shouldn't be shared or
  // indexed under their own address (the 404 page), which then get no canonical link.
  path?: string;
  // An image under public/, shown in link previews
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
}>;

// The page's <head>: title, description, canonical address and the Open Graph and Twitter
// tags that chat apps and social sites read to build a link preview.
export default function Head({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  image = "/assets/img/logo.png",
  imageAlt = "TripSit logo",
  noindex = false,
}: Props) {
  const url = path === undefined ? undefined : `${siteOrigin}${path}`;
  const summary = shortDescription(description);
  return (
    <NextHead>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta name="description" content={summary} key="description" />
      <meta
        name="robots"
        content={noindex ? "noindex,follow" : "all"}
        key="robots"
      />
      <link rel="icon" href="/favicon.ico" />
      {url && <link rel="canonical" href={url} key="canonical" />}
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content="TripSit" key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={summary} key="og:description" />
      {url && <meta property="og:url" content={url} key="og:url" />}
      <meta
        property="og:image"
        content={`${siteOrigin}${image}`}
        key="og:image"
      />
      <meta property="og:image:alt" content={imageAlt} key="og:image:alt" />
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
    </NextHead>
  );
}
