import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import ComboPairPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/combo/[first]/[second]";
import { comboPairProps } from "@/utils/comboPair.server";
import { getComboSources } from "../comboData";

// next/head only writes to the document inside a Next.js app. Here it renders its tags
// directly, and React hoists <title>, <meta> and <link> into document.head.
jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const meta = (name: string) =>
  document.head
    .querySelector(`meta[name="${name}"]`)
    ?.getAttribute("content") ?? null;

describe("getStaticPaths / getStaticProps", () => {
  it("builds a page for each of the chart's 300 pairs and no others", () => {
    const { paths, fallback } = getStaticPaths();
    expect(fallback).toBe(false);
    expect(paths).toHaveLength(300);
    expect(paths).toContainEqual({
      params: { first: "mdma", second: "ssris" },
    });
    expect(paths).toContainEqual({
      params: { first: "alcohol", second: "ghb-gbl" },
    });
  });

  it("gives props for a pair in chart order", () => {
    expect(
      getStaticProps({ params: { first: "mdma", second: "ssris" } }),
    ).toEqual({ props: comboPairProps("MDMA", "SSRIs") });
  });

  it.each([
    ["ssris", "mdma"],
    ["mdma", "mdma"],
    ["mdma", "pregabalin"],
    ["MDMA", "ssris"],
  ])("has no page for /combo/%s/%s", (first, second) => {
    expect(getStaticProps({ params: { first, second } })).toEqual({
      notFound: true,
    });
  });
});

describe("comboPairProps", () => {
  it("brings the rating, its meaning, the sources and the GitHub links", () => {
    const props = comboPairProps("MDMA", "SSRIs");
    expect(props).toMatchObject({
      first: "MDMA",
      second: "SSRIs",
      path: "/combo/mdma/ssris",
      risk: "decrease",
      note: "",
      indexable: false,
    });
    expect(props.rating.label).toBe("Low Risk & Decrease");
    expect(props.definition).toMatch(/^Effects are subtractive\./);
    expect(props.definition).not.toMatch(/ {2}/);
    expect(props.sources).toHaveLength(getComboSources("MDMA", "SSRIs").length);
    expect(props.sources[0]).toEqual({
      title:
        "Discontinuation of medications classified as reuptake inhibitors affects treatment response of MDMA-assisted psychotherapy.",
      author: "Feduccia, A. A., Jerome, L., Mithoefer, M. C., & Holland, J.",
      url: "https://doi.org/10.1007/s00213-020-05710-w",
    });
    expect(props.suggestUrl).toContain("discussions/new");
    expect(props.reviewsUrl).toContain("/issues?q=");
  });

  it("can be sent to the browser as JSON", () => {
    const props = comboPairProps("Alcohol", "GHB/GBL");
    expect(JSON.parse(JSON.stringify(props))).toEqual(props);
  });
});

describe("the page", () => {
  it("shows a sourced pair with no explanation yet, and keeps it out of search results", () => {
    render(<ComboPairPage {...comboPairProps("MDMA", "SSRIs")} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "MDMA + SSRIs" }),
    ).toBeVisible();
    expect(screen.getByText("Low Risk & Decrease")).toBeVisible();
    expect(screen.getByText(/^Effects are subtractive\./)).toBeVisible();
    expect(
      screen.getByText(/No explanation has been written for this combination/),
    ).toBeVisible();

    const sources = within(screen.getByRole("list"));
    expect(sources.getAllByRole("listitem")).toHaveLength(3);
    expect(
      sources.getByRole("link", {
        name: "Serotonin toxicity of serotonergic psychedelics.",
      }),
    ).toHaveAttribute("href", "https://doi.org/10.1007/s00213-021-05876-x");
    expect(sources.getByText("Malcolm, B., & Thomas, K.")).toBeVisible();

    expect(
      screen.getByRole("link", { name: "search past reviews of MDMA + SSRIs" }),
    ).toHaveAttribute(
      "href",
      "https://github.com/TripSit/drugs/issues?q=in%3Atitle+MDMA+SSRIs",
    );
    expect(
      screen
        .getByRole("link", { name: "suggest a change" })
        .getAttribute("href"),
    ).toMatch(/^https:\/\/github\.com\/TripSit\/drugs\/discussions\/new\?/);
    expect(
      screen.getByRole("link", { name: "Check another combination" }),
    ).toHaveAttribute("href", "/combo");

    expect(document.title).toBe("MDMA + SSRIs: Low Risk & Decrease - TripSit");
    expect(meta("robots")).toBe("noindex,follow");
    expect(
      document.head.querySelector('link[rel="canonical"]'),
    ).toHaveAttribute("href", "https://tripsit.me/combo/mdma/ssris");
  });

  it("shows the drug team's explanation, and lets search engines list the page", () => {
    const props = comboPairProps("MDMA", "MAOIs");
    render(<ComboPairPage {...props} />);

    expect(screen.getByText("Dangerous")).toBeVisible();
    expect(screen.getByText(props.note)).toBeVisible();
    expect(
      screen.getByText("No sources have been added for this combination yet."),
    ).toBeVisible();
    expect(meta("robots")).toBe("all");
    expect(meta("description")).toMatch(/^MDMA \+ MAOIs: Dangerous\. MAO-B/);
  });

  it("only links sources with web addresses", () => {
    render(
      <ComboPairPage
        {...comboPairProps("MDMA", "SSRIs")}
        sources={[
          { title: "A book", author: "Someone", url: null },
          {
            title: "https://example.test/page",
            author: "",
            url: "https://example.test/page",
          },
        ]}
      />,
    );
    const sources = within(screen.getByRole("list"));
    expect(sources.getByText("A book").closest("a")).toBeNull();
    expect(
      sources.getByRole("link", { name: "https://example.test/page" }),
    ).toHaveAttribute("href", "https://example.test/page");
  });
});
