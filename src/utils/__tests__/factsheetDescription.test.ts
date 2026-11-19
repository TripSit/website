import type { Drug } from "tripsit_drug_db";
import { factsheetDescription } from "../factsheetDescription";

const drug = (summary?: string) =>
  ({
    name: "x",
    pretty_name: "Example",
    properties: summary === undefined ? {} : { summary },
  }) as Drug;
const general =
  "Dose ranges, durations, effects and interactions for Example, from TripSit's drug database.";

test("uses a full summary on its own", () => {
  const summary =
    "A long and informative summary of the substance, its effects, its history and its risks.";
  expect(factsheetDescription(drug(summary))).toBe(summary);
});

test("follows a short summary with the general description", () => {
  expect(factsheetDescription(drug("Inactive."))).toBe(`Inactive. ${general}`);
  // Ends the summary's sentence when the database left the full stop off.
  expect(
    factsheetDescription(drug("Stimulant drug in the amphetamine family")),
  ).toBe(`Stimulant drug in the amphetamine family. ${general}`);
});

test("falls back to the general description without a summary", () => {
  expect(factsheetDescription(drug())).toBe(general);
  expect(factsheetDescription(drug("   "))).toBe(general);
});
