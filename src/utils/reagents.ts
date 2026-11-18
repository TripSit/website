// Reagent test results arrive from the drug database as one free-text string, for example
// "Marquis: Yellow > Green. | Mecke: Brown. | Simon's No colour change or Purple."
// This splits it into one entry per reagent, and each result into the colours of its stages.

export type ReagentColour =
  | "none"
  | "purple"
  | "violet"
  | "brown"
  | "black"
  | "yellow"
  | "green"
  | "blue"
  | "orange"
  | "red"
  | "pink";

export interface ReagentStage {
  key: string;
  colours: ReagentColour[];
}

export interface ReagentResult {
  key: string;
  reagent: string;
  result: string;
  stages: ReagentStage[];
}

// A few entries leave out the colon after the reagent ("Simon's Red > Brown").
const knownReagents = [
  "Ehrlich's Reagent",
  "Gallic Acid",
  "Liebermann",
  "Mandelin",
  "Marquis",
  "Froehde",
  "Simon's",
  "Ehrlich",
  "Mecke",
  "Folin",
];

const colourWords =
  /\b(no colou?r change|clear|purple|violet|brown|black|yellow|greenish|green|blue|orange|red|pink)\b/g;

function colourOf(word: string): ReagentColour {
  if (word.startsWith("no colo") || word === "clear") return "none";
  if (word === "greenish") return "green";
  return word as ReagentColour;
}

function stageColours(stage: string): ReagentColour[] {
  const colours = Array.from(
    stage.toLowerCase().matchAll(colourWords),
    (match) => colourOf(match[1]),
  );
  return [...new Set(colours)];
}

function splitReagent(part: string) {
  const colon = part.indexOf(":");
  if (colon > 0) {
    return {
      reagent: part.slice(0, colon).trim(),
      result: part.slice(colon + 1).trim(),
    };
  }
  const known = knownReagents.find((name) => part.startsWith(`${name} `));
  if (known) return { reagent: known, result: part.slice(known.length).trim() };
  return { reagent: "", result: part };
}

export function parseReagentResults(text?: string): ReagentResult[] {
  if (!text) return [];
  return text
    .split("|")
    .map((part) => part.trim().replace(/\.$/, "").trim())
    .filter(Boolean)
    .map((part, index) => {
      const { reagent, result } = splitReagent(part);
      return {
        key: `${index}-${reagent}`,
        reagent,
        result,
        stages: result.split(">").map((stage, step) => ({
          key: `${step}-${stage.trim()}`,
          colours: stageColours(stage),
        })),
      };
    });
}
