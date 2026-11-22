import { SUBSTANCES } from "../comboData";
import {
  chartPairs,
  chartSubstance,
  indexedPairPaths,
  pairIsIndexable,
  pairPath,
  reviewSearchUrl,
  substanceFromSlug,
  substanceSlug,
  suggestChangeUrl,
} from "../comboLinks";

describe("substance slugs", () => {
  it("gives every chart substance its own slug, which leads back to it", () => {
    const slugs = SUBSTANCES.map(substanceSlug);
    expect(new Set(slugs).size).toBe(SUBSTANCES.length);
    slugs.forEach((slug, index) => {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(substanceFromSlug(slug)).toBe(SUBSTANCES[index]);
    });
    expect(substanceSlug("GHB/GBL")).toBe("ghb-gbl");
    expect(substanceSlug("5-MeO-xxT")).toBe("5-meo-xxt");
  });

  it("knows nothing of slugs that aren't on the chart", () => {
    expect(substanceFromSlug("pregabalin")).toBeUndefined();
    expect(substanceFromSlug("GHB-GBL")).toBeUndefined();
  });
});

describe("pair pages", () => {
  it("lists each of the chart's 300 pairs once", () => {
    const pairs = chartPairs();
    expect(pairs).toHaveLength((25 * 24) / 2);
    expect(new Set(pairs.map(([a, b]) => pairPath(a, b))).size).toBe(300);
    expect(pairs[0]).toEqual(["LSD", "Mushrooms"]);
    expect(pairs.at(-1)).toEqual(["MAOIs", "SSRIs"]);
  });

  it("gives a pair the same address in either order", () => {
    expect(pairPath("MDMA", "SSRIs")).toBe("/combo/mdma/ssris");
    expect(pairPath("SSRIs", "MDMA")).toBe("/combo/mdma/ssris");
    expect(pairPath("Alcohol", "GHB/GBL")).toBe("/combo/alcohol/ghb-gbl");
  });

  it("lets search engines list only the pages that explain their rating", () => {
    expect(pairIsIndexable("MDMA", "MAOIs")).toBe(true);
    // Rated and sourced, but the note hasn't been written yet.
    expect(pairIsIndexable("MDMA", "SSRIs")).toBe(false);
    const indexed = indexedPairPaths();
    expect(indexed).toContain("/combo/mdma/maois");
    expect(indexed).not.toContain("/combo/mdma/ssris");
  });
});

describe("chartSubstance", () => {
  it.each([
    ["mdma", "MDMA"],
    ["dextromethorphan", "DXM"],
    ["ghb/gbl", "GHB/GBL"],
    ["ghb", "GHB/GBL"],
    ["5-meo-xxt", "5-MeO-xxT"],
    ["SSRIs", "SSRIs"],
    ["pregabalin", undefined],
    ["nitrous oxide", undefined],
  ])("maps the database's %s to the chart's %s", (key, name) => {
    expect(chartSubstance(key)).toBe(name);
  });
});

describe("GitHub links", () => {
  it("opens a Drug Interactions discussion in the drug database, filled in for the pair", () => {
    const url = new URL(
      suggestChangeUrl({
        first: "MDMA",
        second: "SSRIs",
        rating: "Low Risk & Decrease",
      }),
    );
    expect(url.origin + url.pathname).toBe(
      "https://github.com/TripSit/drugs/discussions/new",
    );
    expect(url.searchParams.get("category")).toBe("drug-interactions");
    expect(url.searchParams.get("title")).toBe("MDMA + SSRIs");
    const body = url.searchParams.get("body") ?? "";
    expect(body).toContain("**Combination:** MDMA + SSRIs\n");
    expect(body).toContain("**Current rating:** Low Risk & Decrease\n");
    expect(body).toContain("**Sources:**");
  });

  it("leaves the title for the writer when no pair is given", () => {
    const url = new URL(suggestChangeUrl());
    expect(url.searchParams.get("title")).toBeNull();
    expect(url.searchParams.get("body")).toContain("**Combination:** \n");
  });

  it("searches the drug database's issue titles for both substances", () => {
    const url = new URL(reviewSearchUrl("MDMA", "SSRIs"));
    expect(url.origin + url.pathname).toBe(
      "https://github.com/TripSit/drugs/issues",
    );
    expect(url.searchParams.get("q")).toBe("in:title MDMA SSRIs");
  });
});
