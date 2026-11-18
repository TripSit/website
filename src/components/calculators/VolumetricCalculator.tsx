import { useState, type ChangeEvent } from "react";
import { solidButton } from "../buttonClasses";
import { cardClass, fieldClass } from "./CalculatorPage";
import { divideAmounts, formatAmount } from "./amounts";

// Each calculator reads as one sentence: text, input, text, input, text, result, text.
type Calc = {
  title: string;
  parts: [string, string, string, string];
  // Accessible names for the two inputs and the result
  labels: [string, string, string];
  compute: (first: string, second: string) => number | undefined;
};

const CALCS: Calc[] = [
  {
    title: "How much solvent (water) do you need?",
    parts: [
      "For a solution with",
      "mg/ml, add",
      "mg of the substance to",
      "ml of solvent.",
    ],
    labels: [
      "Concentration you want (mg/ml)",
      "Substance you have (mg)",
      "Solvent needed (ml)",
    ],
    compute: (perMl, total) => divideAmounts(total, perMl),
  },
  {
    title: "What will the concentration of the solution be?",
    parts: [
      "If you put",
      "mg of a substance in",
      "ml of solvent, it will be",
      "mg/ml.",
    ],
    labels: [
      "Substance dissolved (mg)",
      "Solvent used (ml)",
      "Concentration (mg/ml)",
    ],
    compute: (material, solvent) => divideAmounts(material, solvent),
  },
  {
    title: "How much do you need to take?",
    parts: [
      "If you have a solution of",
      "mg/ml, and want to take",
      "mg, you need to take",
      "ml.",
    ],
    labels: [
      "Concentration of your solution (mg/ml)",
      "Dose you want (mg)",
      "Volume to take (ml)",
    ],
    compute: (perMl, dose) => divideAmounts(dose, perMl),
  },
];

type CopyStatus = "idle" | "copied" | "failed";

function SentenceCalc({ calc }: Readonly<{ calc: Calc }>) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const result = calc.compute(first, second);
  const shown = result === undefined ? undefined : formatAmount(result);
  const [p0, p1, p2, p3] = calc.parts;

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${p0} ${first.trim()} ${p1} ${second.trim()} ${p2} ${shown} ${p3}`,
      );
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  function edit(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setCopyStatus("idle");
    };
  }

  return (
    <section className={cardClass}>
      <h2 className="mb-4 mt-0 font-display text-xl font-semibold text-ink">
        {calc.title}
      </h2>
      <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-3 text-lg leading-relaxed text-ink">
        <span>{p0}</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0"
          aria-label={calc.labels[0]}
          className={fieldClass}
          value={first}
          onChange={edit(setFirst)}
        />
        <span>{p1}</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0"
          aria-label={calc.labels[1]}
          className={fieldClass}
          value={second}
          onChange={edit(setSecond)}
        />
        <span>{p2}</span>
        <output
          aria-label={calc.labels[2]}
          className="min-w-24 rounded-lg bg-cyan/15 px-3 py-2 text-center font-semibold text-cyan"
        >
          {shown ?? "?"}
        </output>
        <span>{p3}</span>
      </p>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          className={`${solidButton} bg-violet px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40`}
          disabled={shown === undefined}
          onClick={() => void copy()}
        >
          Copy as text
        </button>
        <output className="text-sm text-mute">
          {copyStatus === "copied" && "Copied"}
          {copyStatus === "failed" && "Couldn't copy. Select the text instead."}
        </output>
      </div>
    </section>
  );
}

export default function VolumetricCalculator() {
  return (
    <div className="grid gap-6">
      {CALCS.map((calc) => (
        <SentenceCalc key={calc.title} calc={calc} />
      ))}
    </div>
  );
}
