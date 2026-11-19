import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Drug } from "tripsit_drug_db";
import Head, {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  shortDescription,
} from "../Head";
import DrugPage from "@/pages/factsheets/[drug]";
import FactsheetsPage from "@/pages/factsheets";
import ComboPage from "@/pages/combo";
import ReflectPrivacyPage from "@/pages/reflect/privacy";
import NotFoundPage from "@/pages/404";

// next/head only writes to the document inside a Next.js app. Here it renders its tags
// directly, and React hoists <title>, <meta> and <link> into document.head.
jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock("../Header", () => () => null);
jest.mock("../Footer", () => () => null);
jest.mock("../DrugInfo", () => () => null);
jest.mock("../Factsheets", () => () => null);
jest.mock("../comboChecker/ComboChecker", () => () => null);

function meta() {
  const { head } = document;
  const content = (selector: string) =>
    head.querySelector(selector)?.getAttribute("content") ?? null;
  return {
    title: head.querySelector("title")?.textContent,
    description: content('meta[name="description"]'),
    canonical:
      head.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    ogTitle: content('meta[property="og:title"]'),
    ogDescription: content('meta[property="og:description"]'),
    ogUrl: content('meta[property="og:url"]'),
    ogImage: content('meta[property="og:image"]'),
    twitterCard: content('meta[name="twitter:card"]'),
  };
}

test("gives a page its own title, description, canonical link and preview tags", () => {
  render(
    <Head
      title="Example - TripSit"
      description="An example page."
      path="/example"
    />,
  );
  expect(meta()).toEqual({
    title: "Example - TripSit",
    description: "An example page.",
    canonical: "https://tripsit.me/example",
    ogTitle: "Example - TripSit",
    ogDescription: "An example page.",
    ogUrl: "https://tripsit.me/example",
    ogImage: "https://tripsit.me/assets/img/logo.png",
    twitterCard: "summary_large_image",
  });
});

test("falls back to the site's title and description, with no canonical link without a path", () => {
  render(<Head />);
  expect(meta()).toMatchObject({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: null,
    ogUrl: null,
  });
});

test("shortens long descriptions to about 160 characters at a word boundary", () => {
  const long = `${"word ".repeat(60)}end`;
  const short = shortDescription(long);
  expect(short.length).toBeLessThanOrEqual(160);
  expect(short).toMatch(/word…$/);
  // Line breaks and runs of spaces in the source text are flattened
  expect(shortDescription("  two\n  lines  ")).toBe("two lines");
  // A single very long word is cut where it has to be
  expect(shortDescription("x".repeat(200))).toBe(`${"x".repeat(159)}…`);
});

test("titles a drug page after the drug and describes it with its summary", () => {
  render(
    <DrugPage
      drugData={
        {
          name: "lsd",
          pretty_name: "LSD",
          properties: { summary: "A classic psychedelic." },
        } as Drug
      }
    />,
  );
  expect(meta()).toMatchObject({
    title: "LSD - TripSit Factsheets",
    // A summary this short is followed by the general description (factsheetDescription).
    description:
      "A classic psychedelic. Dose ranges, durations, effects and interactions for LSD, from TripSit's drug database.",
    canonical: "https://tripsit.me/factsheets/lsd",
  });
});

test("describes a drug page without a summary in general terms", () => {
  render(
    <DrugPage
      drugData={{ name: "2c-b", pretty_name: "2C-B" } as unknown as Drug}
    />,
  );
  expect(meta().description).toBe(
    "Dose ranges, durations, effects and interactions for 2C-B, from TripSit's drug database.",
  );
});

test.each([
  {
    path: "/factsheets",
    Page: FactsheetsPage,
    title: "Drug Factsheets - TripSit",
  },
  {
    path: "/reflect/privacy",
    Page: ReflectPrivacyPage,
    title: "Privacy Policy - Reflect - TripSit",
  },
])("gives $path its own title and address", ({ path, Page, title }) => {
  render(<Page />);
  expect(meta()).toMatchObject({
    title,
    canonical: `https://tripsit.me${path}`,
  });
});

test("previews the combo checker with the combination chart", () => {
  render(<ComboPage />);
  expect(meta()).toMatchObject({
    title: "Drug Combinations - TripSit",
    canonical: "https://tripsit.me/combo",
    ogImage: "https://tripsit.me/assets/img/comboChart.png",
  });
});

test("keeps the 404 page out of canonical links", () => {
  render(<NotFoundPage />);
  expect(meta()).toMatchObject({
    title: "Page not found - TripSit",
    canonical: null,
  });
});
