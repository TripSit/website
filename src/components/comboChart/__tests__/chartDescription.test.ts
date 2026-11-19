import {
  chartDescription,
  LANGUAGES,
  type ChartLanguage,
} from "../translations";

test("gives every chart language its own description", () => {
  const languages = Object.keys(LANGUAGES) as ChartLanguage[];
  const descriptions = languages.map(chartDescription);
  expect(new Set(descriptions).size).toBe(languages.length);
  expect(chartDescription("en")).toBe(
    "TripSit's full drug combination chart, with translations and printable PNG/PDF downloads.",
  );
  // The Polish title ends with a space in its translation file.
  expect(chartDescription("pl")).toBe(
    "Przewodnik po Kombinacjach Leków: TripSit's drug combination chart in Polski, with printable PNG/PDF downloads.",
  );
});
