import cs from "../../assets/comboChart/cs.json";
import de from "../../assets/comboChart/de.json";
import en from "../../assets/comboChart/en.json";
import eo from "../../assets/comboChart/eo.json";
import es from "../../assets/comboChart/es.json";
import fr from "../../assets/comboChart/fr.json";
import it from "../../assets/comboChart/it.json";
import pl from "../../assets/comboChart/pl.json";
import ru from "../../assets/comboChart/ru.json";
import { RISK, type RiskKey } from "../comboChecker/comboData";

export const LANGUAGES = {
  en: "English",
  cs: "Čeština",
  de: "Deutsch",
  eo: "Esperanto",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pl: "Polski",
  ru: "Русский",
};
export type ChartLanguage = keyof typeof LANGUAGES;
export interface ChartTranslation {
  title: string;
  app: string;
  support: string;
  drugs: Record<string, string>;
  interactions: Record<string, string>;
  disclaimer: string[];
}

export const TRANSLATIONS: Record<ChartLanguage, ChartTranslation> = {
  cs,
  de,
  en,
  eo,
  es,
  fr,
  it,
  pl,
  ru,
};

export function isChartLanguage(value: unknown): value is ChartLanguage {
  return typeof value === "string" && Object.hasOwn(LANGUAGES, value);
}

export function drugLabel(translation: ChartTranslation, substance: string) {
  const key = substance.toLowerCase();
  return (
    translation.drugs[key] ||
    en.drugs[key as keyof typeof en.drugs] ||
    substance
  );
}

export function riskLabel(translation: ChartTranslation, risk: RiskKey) {
  const key = risk === "unknown" ? "unknown" : RISK[risk].label.toLowerCase();
  return translation.interactions[key] || RISK[risk].label;
}

export function chartPath(language: ChartLanguage) {
  return language === "en" ? "/combo/chart" : `/combo/chart/${language}`;
}
