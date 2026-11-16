// Reading and showing amounts typed into the calculators.

// Reads a typed amount. A comma counts as a decimal point, so "2,5" works.
// Negative and non-numeric input gives NaN.
export function parseAmount(input: string): number {
  const text = input.trim().replace(",", ".");
  if (text === "" || text.includes("-")) return Number.NaN;
  return Number(text);
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
