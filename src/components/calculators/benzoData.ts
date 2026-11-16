import type { Drug } from "tripsit_drug_db";

// One benzodiazepine as the converter needs it. Built from TripSit's drug
// database at build time, so the page never fetches anything at runtime.
export type Benzo = {
  name: string;
  prettyName: string;
  aliases: string[];
  // The database's own wording, e.g. "Alprazolam - 0.5mg ~=10mg Diazepam."
  equivalence: string;
  // mg of this benzo taken as equal to 10 mg of diazepam
  equivalentMg: number;
  summary: string | null;
  effects: string | null;
  duration: string | null;
  afterEffects: string | null;
  doses: { level: string; amount: string }[];
};

const DOSE_LEVELS = ["Light", "Low", "Common", "Strong", "Heavy"];

// The first number in the equivalence text. For a range ("5-6mg's") that is
// the low end, as in the original converter.
export function equivalentMg(text: string): number | undefined {
  const match = /\d+(?:\.\d+)?/.exec(text);
  const mg = match ? Number(match[0]) : 0;
  return mg > 0 ? mg : undefined;
}

// The real data uses capitalised route and level keys ("Oral", "Common"),
// unlike the package's Dose type, so it is read as plain records.
function oralDoses(drug: Drug): Benzo["doses"] {
  const routes = (drug.formatted_dose ?? {}) as Record<
    string,
    Record<string, string>
  >;
  const route = routes.Oral ?? Object.values(routes)[0] ?? {};
  return DOSE_LEVELS.filter((level) => route[level]).map((level) => ({
    level,
    amount: route[level],
  }));
}

export function benzosFrom(drugs: Record<string, Drug>): Benzo[] {
  const benzos: Benzo[] = [];
  for (const drug of Object.values(drugs)) {
    const equivalence = drug.properties?.dose_to_diazepam;
    const mg = equivalence ? equivalentMg(equivalence) : undefined;
    if (!equivalence || mg === undefined) continue;

    const seen = new Set([drug.name.toLowerCase()]);
    const aliases = (drug.aliases ?? []).filter((alias) => {
      const lower = alias.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

    benzos.push({
      name: drug.name,
      prettyName: drug.pretty_name,
      aliases,
      equivalence,
      equivalentMg: mg,
      summary: drug.properties.summary ?? null,
      effects: drug.properties.effects ?? null,
      duration: drug.properties.duration ?? null,
      afterEffects: drug.properties["after-effects"] ?? null,
      doses: oralDoses(drug),
    });
  }
  return benzos.sort((a, b) => a.prettyName.localeCompare(b.prettyName));
}

// The dose of `to` roughly equal to `dose` mg of `from`.
export function convertDose(dose: number, from: Benzo, to: Benzo): number {
  return (dose / from.equivalentMg) * to.equivalentMg;
}
