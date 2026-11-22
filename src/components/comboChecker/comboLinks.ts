// Addresses for combinations: each pair's page on this site, and the places on GitHub where
// TripSit's drug team reviews ratings and takes suggestions.
import { SUBSTANCES, comboKey, getCombo, tidyText } from "./comboData";

const DRUGS_REPO = "https://github.com/TripSit/drugs";

// "GHB/GBL" → "ghb-gbl". The tests check that every chart name gives a different slug.
export function substanceSlug(substance: string): string {
  return substance.toLowerCase().replaceAll("/", "-");
}

export function substanceFromSlug(slug: string): string | undefined {
  return SUBSTANCES.find((substance) => substanceSlug(substance) === slug);
}

// Every pair on the chart once, each in chart order: LSD + Mushrooms … MAOIs + SSRIs.
export function chartPairs(): [string, string][] {
  return SUBSTANCES.flatMap((first, index) =>
    SUBSTANCES.slice(index + 1).map((second): [string, string] => [
      first,
      second,
    ]),
  );
}

// A pair's page, such as /combo/mdma/ssris. Both must be chart substances. They're put in
// chart order, so SSRIs + MDMA gets the same address as MDMA + SSRIs.
export function pairPath(a: string, b: string): string {
  const [first, second] =
    SUBSTANCES.indexOf(a) <= SUBSTANCES.indexOf(b) ? [a, b] : [b, a];
  return `/combo/${substanceSlug(first)}/${substanceSlug(second)}`;
}

// The database spells GHB's factsheet "ghb"; the chart calls it GHB/GBL.
const FACTSHEET_NAMES: Record<string, string> = { ghb: "GHB/GBL" };

// The chart's name for a drug database key ("dextromethorphan" → "DXM"), or undefined for
// substances the chart leaves out, such as pregabalin.
export function chartSubstance(key: string): string | undefined {
  const lower = key.toLowerCase();
  return (
    SUBSTANCES.find(
      (substance) =>
        comboKey(substance) === lower || substance.toLowerCase() === lower,
    ) ?? FACTSHEET_NAMES[lower]
  );
}

// Suggestions go to the drug database's "Drug Interactions" discussions, which its README
// points people new to GitHub to. The drug team accepts changes only with a reliable source.
export function suggestChangeUrl(
  pair?: Readonly<{ first: string; second: string; rating: string }>,
): string {
  const name = pair ? `${pair.first} + ${pair.second}` : "";
  const params = new URLSearchParams({ category: "drug-interactions" });
  if (name) params.set("title", name);
  params.set(
    "body",
    [
      `**Combination:** ${name}`,
      `**Current rating:** ${pair?.rating ?? ""}`,
      "**Suggested rating:** ",
      "",
      "**What should change, and why:**",
      "",
      "",
      "**Sources:**",
      "<!-- Changes need a reliable source: a peer-reviewed study, a .gov or .edu page, a book or a harm reduction organisation. -->",
      "",
    ].join("\n"),
  );
  return `${DRUGS_REPO}/discussions/new?${params}`;
}

// The drug database's issues whose titles name both substances, which is how the drug team
// titles its reviews ("MDMA + SSRIs"). Most pairs from the original chart have none yet.
export function reviewSearchUrl(first: string, second: string): string {
  const query = `in:title ${first} ${second}`;
  return `${DRUGS_REPO}/issues?${new URLSearchParams({ q: query })}`;
}

// Search engines may list a pair's page once the drug team has explained its rating. The
// others are marked noindex and left out of the sitemap, since they'd only repeat the chart.
export function pairIsIndexable(first: string, second: string): boolean {
  const { risk, note } = getCombo(first, second);
  return risk !== "unknown" && tidyText(note) !== "";
}

export function indexedPairPaths(): string[] {
  return chartPairs()
    .filter(([first, second]) => pairIsIndexable(first, second))
    .map(([first, second]) => pairPath(first, second));
}
