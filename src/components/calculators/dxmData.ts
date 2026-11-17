// Products, plateaus and maths for the DXM calculator, which used to be
// dxm.tripsit.me (TripSit/DXM-Calculator).

export type DxmProduct = {
  name: string;
  // mg of DXM HBr in one unit of the product (one ml, oz, capsule or tablet)
  mgPerUnit: number;
  // What the doses are counted in
  unit: string;
};

// The plateau doses are mg of DXM hydrobromide: the monohydrate salt in US
// products, 370.33 g/mol. Freebase DXM (271.40 g/mol) has no salt or water, so
// 1 mg of freebase carries as much DXM as 1.3645 mg of HBr.
const HBR_MG_PER_FREEBASE_MG = 370.33 / 271.4;

// Each product has DXM as its only active ingredient: HBr unless the name says
// freebase. A label that lists plain "dextromethorphan" (no HBr or
// hydrobromide) is freebase.
export const DXM_PRODUCTS: DxmProduct[] = [
  // NDC 71598-102: dextromethorphan HBr 30 mg per 3 ml
  { name: "RoboCough (ml)", mgPerUnit: 10, unit: "ml" },
  { name: "Robitussin DX (oz)", mgPerUnit: 88.5, unit: "oz" },
  { name: "Robitussin DX (ml)", mgPerUnit: 3, unit: "ml" },
  { name: "Robitussin Gelcaps (15 mg caps)", mgPerUnit: 15, unit: "caps" },
  { name: "30mg Gelcaps (30 mg caps)", mgPerUnit: 30, unit: "caps" },
  // NDC 71598-100: dextromethorphan hydrobromide 30 mg
  { name: "RoboHBr (30 mg tablets)", mgPerUnit: 30, unit: "tablets" },
  // NDC 71598-015: dextromethorphan (freebase) 30 mg, about 40.94 mg of HBr
  {
    name: "RoboTablets (30 mg freebase tablets)",
    mgPerUnit: 30 * HBR_MG_PER_FREEBASE_MG,
    unit: "tablets",
  },
  { name: "Pure DXM HBr powder (mg)", mgPerUnit: 1, unit: "mg" },
  {
    name: "Pure DXM freebase powder (mg)",
    mgPerUnit: HBR_MG_PER_FREEBASE_MG,
    unit: "mg",
  },
];

// Dose ranges in mg of DXM HBr per kg of body weight.
const PLATEAUS = [
  { name: "1st", minMgPerKg: 1.5, maxMgPerKg: 2.5 },
  { name: "2nd", minMgPerKg: 2.5, maxMgPerKg: 7.5 },
  { name: "3rd", minMgPerKg: 7.5, maxMgPerKg: 15 },
  { name: "4th", minMgPerKg: 15, maxMgPerKg: 20 },
] as const;

export const KG_PER_UNIT = { kg: 1, lbs: 0.4536 } as const;

export type WeightUnit = keyof typeof KG_PER_UNIT;

// Choices for "mg of DXM per ... ml" when typing a product's strength.
export const STRENGTH_VOLUMES_ML = [1, 3, 5, 10, 15, 20] as const;

export function toKg(weight: number, unit: WeightUnit): number {
  return KG_PER_UNIT[unit] * weight;
}

export type PlateauAmounts = {
  name: string;
  minMgPerKg: number;
  maxMgPerKg: number;
  min: number;
  max: number;
};

// How much of the product reaches each plateau:
// weight (kg) × dose (mg/kg) ÷ strength (mg per unit).
export function plateauAmounts(
  weightKg: number,
  mgPerUnit: number,
): PlateauAmounts[] {
  const unitsPerMgKg = weightKg / mgPerUnit;
  return PLATEAUS.map((plateau) => ({
    ...plateau,
    min: unitsPerMgKg * plateau.minMgPerKg,
    max: unitsPerMgKg * plateau.maxMgPerKg,
  }));
}
