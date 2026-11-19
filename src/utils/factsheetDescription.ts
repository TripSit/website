import type { Drug } from "tripsit_drug_db";

// Shorter summaries ("Inactive.") make thin, sometimes identical search descriptions, so the
// general description follows them.
const SHORT_SUMMARY = 80;

// The page's meta description: the drug's summary, or the general description, or both.
export function factsheetDescription(drug: Drug): string {
  const general = `Dose ranges, durations, effects and interactions for ${drug.pretty_name}, from TripSit's drug database.`;
  const summary = drug.properties?.summary?.trim();
  if (!summary) return general;
  if (summary.length >= SHORT_SUMMARY) return summary;
  const sentence = /[.!?]$/.test(summary) ? summary : `${summary}.`;
  return `${sentence} ${general}`;
}
