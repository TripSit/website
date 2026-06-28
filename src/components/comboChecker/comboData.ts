// Combo Checker data + interaction logic.
// Interaction data is TripSit's canonical combo dataset (comboInteractions.json,
// the same matrix used at combo.tripsit.me). The visual risk system (colors/glyphs)
// comes from the Claude Design "Combo Checker" handoff.

import rawInteractions from "./comboInteractions.json";

export type RiskKey =
  | "synergy"
  | "nosynergy"
  | "decrease"
  | "caution"
  | "unsafe"
  | "dangerous"
  | "unknown";

export interface RiskDef {
  label: string;
  glyph: string;
  badge: string; // solid badge bg
  cBg: string; // tonal container bg
  cText: string; // on-container text
}

// Display order + grouping from TripSit's combo chart config (tableOrder / groupNames).
// Substance labels here are lowercased to look up keys in comboInteractions.json.
export const GROUPS: { name: string; substances: string[] }[] = [
  {
    name: "Psychedelics",
    substances: [
      "LSD",
      "Mushrooms",
      "DMT",
      "Mescaline",
      "DOx",
      "NBOMes",
      "2C-x",
      "2C-T-x",
      "5-MeO-xxT",
      "Cannabis",
    ],
  },
  { name: "Dissociatives", substances: ["Ketamine", "MXE", "DXM", "Nitrous"] },
  {
    name: "Stimulants",
    substances: ["Amphetamines", "MDMA", "Cocaine", "Caffeine"],
  },
  {
    name: "Depressants",
    substances: [
      "Alcohol",
      "GHB/GBL",
      "Opioids",
      "Tramadol",
      "Benzodiazepines",
    ],
  },
  { name: "Antidepressants", substances: ["MAOIs", "SSRIs"] },
];

export const SUBSTANCES: string[] = GROUPS.flatMap((g) => g.substances);

// Material 3 Expressive tonal roles (light): container bg / on-container text / solid badge
export const RISK: Record<RiskKey, RiskDef> = {
  synergy: {
    label: "Low Risk & Synergy",
    glyph: "↑",
    badge: "#3A8C42",
    cBg: "#EAF4EA",
    cText: "#234D29",
  },
  nosynergy: {
    label: "Low Risk & No Synergy",
    glyph: "◉",
    badge: "#2E72BD",
    cBg: "#EAF1F9",
    cText: "#234E78",
  },
  decrease: {
    label: "Low Risk & Decrease",
    glyph: "↓",
    badge: "#2293A0",
    cBg: "#E6F2F3",
    cText: "#1E545B",
  },
  caution: {
    label: "Caution",
    glyph: "!",
    badge: "#B5811C",
    cBg: "#F7EFDD",
    cText: "#6B4E12",
  },
  unsafe: {
    label: "Unsafe",
    glyph: "!!",
    badge: "#CA6A2E",
    cBg: "#F8ECE2",
    cText: "#723A18",
  },
  dangerous: {
    label: "Dangerous",
    glyph: "✕",
    badge: "#C5453F",
    cBg: "#F8E8E7",
    cText: "#6E2522",
  },
  unknown: {
    label: "Unknown",
    glyph: "?",
    badge: "#6B7077",
    cBg: "#EEEFF1",
    cText: "#3C3F44",
  },
};

export const RANK: Record<RiskKey, number> = {
  dangerous: 6,
  unsafe: 5,
  caution: 4,
  unknown: 3,
  decrease: 2,
  nosynergy: 1,
  synergy: 0,
};

export const LEGEND_ORDER: RiskKey[] = [
  "synergy",
  "nosynergy",
  "decrease",
  "caution",
  "unsafe",
  "dangerous",
  "unknown",
];

interface Interaction {
  status: string;
  note?: string;
}
const INTERACTIONS = rawInteractions as Record<
  string,
  Record<string, Interaction>
>;

const STATUS_TO_RISK: Record<string, RiskKey> = {
  "Low Risk & Synergy": "synergy",
  "Low Risk & No Synergy": "nosynergy",
  "Low Risk & Decrease": "decrease",
  Caution: "caution",
  Unsafe: "unsafe",
  Dangerous: "dangerous",
};

const UNKNOWN_NOTE =
  "There isn't enough reliable data on this combination. Treat it as potentially risky and research it thoroughly.";

export function getCombo(
  a: string,
  b: string,
): { risk: RiskKey; note: string } {
  const ka = a.toLowerCase();
  const kb = b.toLowerCase();
  const entry = INTERACTIONS[ka]?.[kb] ?? INTERACTIONS[kb]?.[ka];
  if (!entry) return { risk: "unknown", note: UNKNOWN_NOTE };
  return {
    risk: STATUS_TO_RISK[entry.status] ?? "unknown",
    note: entry.note ?? "",
  };
}

// Accent color -> tonal container/on-container roles (used for empty state + focus tones).
const ACCENT_TONES: Record<string, { container: string; on: string }> = {
  "#2487ce": { container: "#e3f1fb", on: "#16507b" },
  "#683394": { container: "#efe6f6", on: "#51277a" },
  "#47aeff": { container: "#e4f2ff", on: "#15598c" },
  "#11dbcf": { container: "#d6f7f5", on: "#0a7a73" },
};

export function accentTone(accent: string): { container: string; on: string } {
  return ACCENT_TONES[accent] || { container: "#e3f1fb", on: "#16507b" };
}
