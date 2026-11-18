import { SUBSTANCES } from "../comboChecker/comboData";

export const LICENSE_NAME = "PolyForm Noncommercial 1.0.0";
export const LICENSE_URL =
  "https://polyformproject.org/licenses/noncommercial/1.0.0";
export const LICENSE_NOTICE = `Chart © TripSit. Licensed under ${LICENSE_NAME}.`;
export const GROUP_COLORS = [
  "#274e13",
  "#20124d",
  "#660000",
  "#073763",
  "#783f04",
];
export const CHART_COLORS = {
  synergy: "#0a89dd",
  nosynergy: "#35afff",
  decrease: "#006cb3",
  caution: "#d5c625",
  unsafe: "#d98427",
  dangerous: "#d12128",
  unknown: "#6f6f6f",
};

export function orderedSubstances(selected: readonly string[]) {
  return SUBSTANCES.filter((name) => selected.includes(name));
}

export function exportError(
  selected: readonly string[],
  width: number,
  height: number,
): string | null {
  if (orderedSubstances(selected).length < 2)
    return "Select at least two substances.";
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 320 ||
    height < 320 ||
    width > 8192 ||
    height > 8192
  ) {
    return "Width and height must be whole numbers between 320 and 8192 pixels.";
  }
  if (width * height > 32_000_000)
    return "Choose dimensions totaling no more than 32 million pixels.";
  return null;
}

export function posterWidth(count: number) {
  return Math.max(1600, (count + 1) * 145 + 128);
}
