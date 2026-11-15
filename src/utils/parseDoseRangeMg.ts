const massInMg = { ng: 0.000001, ug: 0.001, mg: 1, g: 1000 };
type MassUnit = keyof typeof massInMg;

export function parseDoseRangeMg(text: string): [number, number] | undefined {
  // Require two explicit endpoints and at least one mass unit.
  const endpoints = text
    .toLowerCase()
    .replace(/[\u00b5\u03bc]/gu, "u")
    .split(/[-\u2013\u2014]/u);
  if (endpoints.length !== 2) return;

  const quantity = /^(\d+(?:\.\d+)?|\.\d+)\s*(ng|ug|mg|g)?$/u;
  const lower = quantity.exec(endpoints[0].trim());
  const upper = quantity.exec(endpoints[1].trim());
  if (!lower || !upper) return;

  const [, low, lowUnit] = lower;
  const [, high, highUnit] = upper;
  if (!lowUnit && !highUnit) return;

  const startUnit = (lowUnit || highUnit) as MassUnit;
  const endUnit = (highUnit || lowUnit) as MassUnit;
  const start = Number(low) * massInMg[startUnit];
  const end = Number(high) * massInMg[endUnit];
  if (Number.isFinite(start) && Number.isFinite(end) && start < end) {
    return [start, end];
  }
}
