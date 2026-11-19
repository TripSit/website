import { useId, useState, type ChangeEvent } from "react";
import { cardClass, fieldClass, selectClass } from "./CalculatorPage";
import { ambiguousAmountHint, formatAmount, parseAmount } from "./amounts";
import {
  DXM_PRODUCTS,
  KG_PER_UNIT,
  STRENGTH_VOLUMES_ML,
  plateauAmounts,
  toKg,
  type WeightUnit,
} from "./dxmData";

// Pick a listed product, or type the strength from the label.
type Mode = "product" | "strength";

const MODES: { value: Mode; label: string }[] = [
  { value: "product", label: "Pick from a list" },
  { value: "strength", label: "Enter its strength" },
];

const WEIGHT_UNITS = Object.keys(KG_PER_UNIT) as WeightUnit[];

const sentenceClass = "m-0 flex flex-wrap items-center gap-x-2 gap-y-3";

// On a phone the table has about 260px, so the columns sit closer, the
// amounts are smaller and the label reads "1st" (the column says "Plateau").
// pr-3 would be Bootstrap's !important 1rem, hence the arbitrary value.
const cellGap = "pr-[0.75rem] md:pr-6";
const valueClass =
  "text-right text-base font-semibold tabular-nums text-cyan md:text-lg";

const noteClass =
  "rounded-xl border-[1px] border-solid border-amber/50 bg-amber/10 px-6 py-3.5 text-sm leading-relaxed text-ink [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2";

// A typed amount above zero, or NaN, which the maths carries through to "?".
function positiveAmount(text: string): number {
  const amount = parseAmount(text);
  return amount > 0 ? amount : Number.NaN;
}

function ModeSwitch({
  mode,
  onChange,
}: Readonly<{ mode: Mode; onChange: (mode: Mode) => void }>) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-2">
      <span
        id={labelId}
        className="text-xs font-semibold uppercase tracking-widest text-mute"
      >
        Your product
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex flex-wrap gap-2"
      >
        {MODES.map((option) => (
          <label
            key={option.value}
            className="relative cursor-pointer rounded-full border-[1px] border-solid border-line px-6 py-2 text-base text-mute transition hover:text-ink has-checked:border-cyan has-checked:bg-cyan/15 has-checked:text-cyan has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cyan"
          >
            <input
              type="radio"
              name="dxm-mode"
              value={option.value}
              checked={mode === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function DxmCalculator() {
  const [mode, setMode] = useState<Mode>("product");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [productIndex, setProductIndex] = useState("0");
  const [strength, setStrength] = useState("");
  const [perMl, setPerMl] = useState(String(STRENGTH_VOLUMES_ML[0]));

  const product = DXM_PRODUCTS[Number(productIndex)];
  const byProduct = mode === "product";
  const mgPerUnit = byProduct
    ? product.mgPerUnit
    : positiveAmount(strength) / Number(perMl);
  const unit = byProduct ? product.unit : "ml";
  const rows = plateauAmounts(
    toKg(positiveAmount(weight), weightUnit),
    mgPerUnit,
  );
  // Blank, zero, junk or absurdly large input gives no answer.
  const ready = rows.every((row) => row.min > 0 && Number.isFinite(row.max));

  let summary: string;
  if (!ready) {
    summary = byProduct
      ? "Enter your weight to see the doses."
      : "Enter your weight and your product's strength to see the doses.";
  } else if (byProduct) {
    summary = `How much ${product.name} to take if you weigh ${weight.trim()} ${weightUnit}.`;
  } else {
    summary = `How many ml of a product with ${strength.trim()} mg of DXM per ${perMl} ml to take if you weigh ${weight.trim()} ${weightUnit}.`;
  }

  const show = (value: number) =>
    ready ? `${formatAmount(value)} ${unit}` : "?";

  function edit(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setter(event.target.value);
  }

  return (
    <>
      <div className={`${cardClass} flex flex-col gap-6 text-lg text-ink`}>
        <ModeSwitch mode={mode} onChange={setMode} />
        <p className={sentenceClass}>
          <span>I weigh</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            aria-label="Your weight"
            className={fieldClass}
            value={weight}
            onChange={edit(setWeight)}
          />
          <select
            aria-label="Weight unit"
            className={selectClass}
            value={weightUnit}
            onChange={edit((value) => setWeightUnit(value as WeightUnit))}
          >
            {WEIGHT_UNITS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {mode === "product" ? (
            <>
              <span>and I&apos;m taking</span>
              <select
                aria-label="Product"
                className={selectClass}
                value={productIndex}
                onChange={edit(setProductIndex)}
              >
                {DXM_PRODUCTS.map((item, index) => (
                  <option key={item.name} value={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <span>and my product has</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                aria-label="DXM in your product (mg)"
                className={fieldClass}
                value={strength}
                onChange={edit(setStrength)}
              />
              <span>mg of DXM per</span>
              <select
                aria-label="Volume of your product (ml)"
                className={selectClass}
                value={perMl}
                onChange={edit(setPerMl)}
              >
                {STRENGTH_VOLUMES_ML.map((ml) => (
                  <option key={ml} value={ml}>
                    {ml} ml
                  </option>
                ))}
              </select>
            </>
          )}
        </p>
        {/* Says why an amount like "1,000" gives no answer, instead of a bare "?". */}
        <output className="block text-sm text-amber empty:hidden">
          {ambiguousAmountHint(
            weight,
            ...(mode === "product" ? [] : [strength]),
          )}
        </output>
        {mode === "product" ? (
          <p className={`m-0 ${noteClass}`}>
            All the products listed here have DXM as their only active
            ingredient, as DXM HBr unless the name says freebase. Freebase is
            stronger per mg (30 mg is about 41 mg of HBr), and the calculator
            allows for it. Product not listed? Send us a link to it{" "}
            <a href="https://discord.gg/tripsit">on Discord</a>, or enter its
            strength yourself.
          </p>
        ) : (
          <p className={`m-0 ${noteClass}`}>
            Make sure your product doesn&apos;t contain{" "}
            <a href="https://wiki.tripsit.me/wiki/DXM#Adulteration">
              acetaminophen (paracetamol), guaifenesin, antihistamines or
              pseudoephedrine
            </a>
            {". "}
            This calculator is still only for products with DXM HBr (the label
            says “dextromethorphan HBr” or “hydrobromide”). Plain
            “dextromethorphan” is freebase, which is stronger per mg: pick a
            freebase option from the list instead.
          </p>
        )}
      </div>

      <div className={`${cardClass} mt-6`}>
        <h2 className="m-0 font-display text-xl font-semibold text-ink">
          Dose for each plateau
        </h2>
        <p className="mb-0 mt-2 text-sm text-mute">
          <output aria-label="What the table shows">{summary}</output>
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-ink">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-mute">
                <th scope="col" className={`pb-2 ${cellGap} font-semibold`}>
                  Plateau
                </th>
                <th
                  scope="col"
                  className={`pb-2 ${cellGap} text-right font-semibold`}
                >
                  Minimum
                </th>
                <th scope="col" className="pb-2 text-right font-semibold">
                  Maximum
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((plateau) => (
                <tr
                  key={plateau.name}
                  className="border-x-0 border-b-0 border-t-[1px] border-solid border-line"
                >
                  <th scope="row" className={`py-2.5 ${cellGap} font-normal`}>
                    <span className="block font-semibold">
                      {plateau.name}
                      <span className="max-md:sr-only"> plateau</span>
                    </span>
                    <span className="block whitespace-nowrap text-sm text-mute">
                      {plateau.minMgPerKg}–{plateau.maxMgPerKg} mg/kg
                    </span>
                  </th>
                  <td className={`py-2.5 ${cellGap} ${valueClass}`}>
                    {show(plateau.min)}
                  </td>
                  <td className={`py-2.5 ${valueClass}`}>
                    {show(plateau.max)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-[1px] border-solid border-amber/50 bg-amber/10 p-6 text-sm leading-relaxed text-ink">
        <strong>Important:</strong> always start low and work your way up until
        you find the dose that&apos;s right for you.
      </div>
    </>
  );
}
