import comboDefinitions from "../assets/comboDefinitions.json";
import {
  RISK,
  getCombo,
  getComboSources,
  shownSources,
  tidyText,
  type RiskDef,
  type RiskKey,
  type ShownSource,
} from "../components/comboChecker/comboData";
import {
  pairIsIndexable,
  pairPath,
  reviewSearchUrl,
  suggestChangeUrl,
} from "../components/comboChecker/comboLinks";

export interface ComboPairProps {
  first: string;
  second: string;
  path: string;
  risk: RiskKey;
  rating: RiskDef;
  definition: string;
  note: string;
  sources: ShownSource[];
  // Pages without an explanation are kept out of search results until one is written.
  indexable: boolean;
  suggestUrl: string;
  reviewsUrl: string;
}

// Everything the page shows, worked out at build time so the page doesn't ship the database.
export function comboPairProps(first: string, second: string): ComboPairProps {
  const { risk, note } = getCombo(first, second);
  const rating = RISK[risk];
  const definition =
    comboDefinitions.find((entry) => entry.status === rating.label)
      ?.definition ?? "";
  return {
    first,
    second,
    path: pairPath(first, second),
    risk,
    rating,
    definition: tidyText(definition),
    note: tidyText(note),
    sources: shownSources(getComboSources(first, second)),
    indexable: pairIsIndexable(first, second),
    suggestUrl: suggestChangeUrl({ first, second, rating: rating.label }),
    reviewsUrl: reviewSearchUrl(first, second),
  };
}
