// Reading and showing amounts typed into the calculators.

// One separator with exactly three digits after a whole number, like "1,000" or "2.500".
// That's a thousands separator in some places (US 1,000; German 1.000) and a decimal
// point in others (much of Europe writes 1,000 for 1; the US writes 1.000 for 1).
// Guessing wrong is a thousandfold dose error: "1,000" mg was read as 1 mg, so the
// volumetric calculator asked for a thousandth of the solvent. These aren't read at all.
const AMBIGUOUS = /^[1-9]\d{0,2}[.,]\d{3}$/;

// Reads a typed amount. A comma counts as a decimal point, so "2,5" works.
// Negative, non-numeric and ambiguous input (see AMBIGUOUS) gives NaN.
export function parseAmount(input: string): number {
  const trimmed = input.trim();
  if (AMBIGUOUS.test(trimmed)) return Number.NaN;
  const text = trimmed.replace(",", ".");
  if (text === "" || text.includes("-")) return Number.NaN;
  return Number(text);
}

// What to tell someone whose amount could mean two numbers (the first such input), or
// undefined when none does.
export function ambiguousAmountHint(...inputs: string[]): string | undefined {
  const text = inputs
    .map((input) => input.trim())
    .find((input) => AMBIGUOUS.test(input));
  if (text === undefined) return undefined;
  const [whole, fraction] = text.split(/[.,]/);
  const thousands = `${whole}${fraction}`;
  const decimal = String(Number(`${whole}.${fraction}`));
  return `“${text}” could mean ${thousands} or ${decimal}. Type ${thousands} or ${decimal} instead.`;
}

// a / b for two typed amounts, or undefined when there is no sensible answer
// (blank, zero, negative or non-numeric input).
export function divideAmounts(a: string, b: string): number | undefined {
  const result = parseAmount(a) / parseAmount(b);
  if (!Number.isFinite(result) || result <= 0) return undefined;
  return result;
}

// Two decimals for everyday amounts, three significant figures below 1 so
// small volumes like 0.0125 ml don't round away to 0.01.
export function formatAmount(value: number): string {
  const rounded =
    value >= 1 ? Math.round(value * 100) / 100 : Number(value.toPrecision(3));
  return String(rounded);
}
