import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cardClass, fieldClass, selectClass } from "./CalculatorPage";
import { ambiguousAmountHint, formatAmount, parseAmount } from "./amounts";
import { convertDose, type Benzo } from "./benzoData";

// Option values are "<name>" for a benzo and "<name>/<alias>" for one of its
// other names, so picking "Xanax" keeps showing "Xanax" in the menu.
function benzoFor(benzos: Benzo[], value: string): Benzo {
  const name = value.split("/")[0];
  return benzos.find((benzo) => benzo.name === name) ?? benzos[0];
}

function defaultValue(benzos: Benzo[], name: string, fallback: number) {
  return benzos.some((benzo) => benzo.name === name)
    ? name
    : benzos[Math.min(fallback, benzos.length - 1)].name;
}

const capitalise = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

function BenzoSelect({
  label,
  benzos,
  value,
  onChange,
}: Readonly<{
  label: string;
  benzos: Benzo[];
  value: string;
  onChange: (value: string) => void;
}>) {
  const otherNames = benzos
    .flatMap((benzo) =>
      benzo.aliases.map((alias) => ({
        value: `${benzo.name}/${alias}`,
        label: `${capitalise(alias)} (${benzo.prettyName})`,
      })),
    )
    .sort((a, b) => a.label.localeCompare(b.label));
  return (
    <select
      aria-label={label}
      className={selectClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <optgroup label="Benzodiazepines">
        {benzos.map((benzo) => (
          <option key={benzo.name} value={benzo.name}>
            {benzo.prettyName}
          </option>
        ))}
      </optgroup>
      {otherNames.length > 0 && (
        <optgroup label="Other names">
          {otherNames.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}

function InfoSection({
  title,
  children,
}: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <div className="mt-6">
      <h3 className="mb-1 mt-0 font-display text-base font-semibold text-ink">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-mute">{children}</div>
    </div>
  );
}

function BenzoInfo({
  label,
  benzo,
}: Readonly<{ label: string; benzo: Benzo }>) {
  return (
    <section className={cardClass} aria-label={`${label}: ${benzo.prettyName}`}>
      <p className="mb-0 text-xs font-semibold uppercase tracking-widest text-violet">
        {label}
      </p>
      <h2 className="mb-0 mt-1 font-display text-2xl font-semibold text-ink">
        <Link
          href={`/factsheets/${encodeURIComponent(benzo.name)}`}
          className="text-ink underline-offset-4 hover:text-cyan hover:underline"
        >
          {benzo.prettyName}
        </Link>
      </h2>
      <p className="mb-0 mt-2 text-sm text-mute">{benzo.equivalence}</p>
      {benzo.summary && (
        <InfoSection title="Summary">{benzo.summary}</InfoSection>
      )}
      {benzo.effects && (
        <InfoSection title="Effects">{benzo.effects}</InfoSection>
      )}
      <InfoSection title="Oral dose">
        {benzo.doses.length > 0 ? (
          <ul className="m-0 list-none pl-0">
            {benzo.doses.map((dose) => (
              <li key={dose.level}>
                {dose.level}: {dose.amount}
              </li>
            ))}
          </ul>
        ) : (
          "No dose information available"
        )}
      </InfoSection>
      {benzo.duration && (
        <InfoSection title="Duration">{benzo.duration}</InfoSection>
      )}
      {benzo.afterEffects && (
        <InfoSection title="After-effects">{benzo.afterEffects}</InfoSection>
      )}
    </section>
  );
}

export default function BenzoConverter({
  benzos,
}: Readonly<{ benzos: Benzo[] }>) {
  // Hooks first: an empty list is handled after them.
  const [dose, setDose] = useState("");
  const [fromValue, setFromValue] = useState(() =>
    benzos.length > 0 ? defaultValue(benzos, "alprazolam", 0) : "",
  );
  const [toValue, setToValue] = useState(() =>
    benzos.length > 0 ? defaultValue(benzos, "diazepam", 1) : "",
  );

  if (benzos.length === 0) {
    return (
      <p className="m-0 text-mute">
        The converter couldn&apos;t load its benzodiazepine list. Please try
        again later.
      </p>
    );
  }

  const from = benzoFor(benzos, fromValue);
  const to = benzoFor(benzos, toValue);
  const amount = parseAmount(dose);
  const result =
    Number.isFinite(amount) && amount > 0
      ? formatAmount(convertDose(amount, from, to))
      : undefined;

  return (
    <>
      <div className={`${cardClass} flex flex-col gap-4 text-lg text-ink`}>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-3">
          <span>I have</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            aria-label="Dose you have (mg)"
            className={fieldClass}
            value={dose}
            onChange={(event) => setDose(event.target.value)}
          />
          <span>mg of</span>
          <BenzoSelect
            label="Benzodiazepine you have"
            benzos={benzos}
            value={fromValue}
            onChange={setFromValue}
          />
        </p>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-3">
          <span>I want to know the dose for</span>
          <BenzoSelect
            label="Benzodiazepine to convert to"
            benzos={benzos}
            value={toValue}
            onChange={setToValue}
          />
        </p>
        <p className="m-0 rounded-xl bg-cyan/15 px-4 py-3 font-semibold text-cyan">
          <output aria-label="Converted dose">
            {result === undefined
              ? (ambiguousAmountHint(dose) ?? "Enter a dose to convert.")
              : `${dose.trim()} mg of ${from.prettyName} is roughly ${result} mg of ${to.prettyName}.`}
          </output>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border-[1px] border-solid border-amber/50 bg-amber/10 p-6 text-sm leading-relaxed text-ink">
        <strong>Important:</strong> equivalent doses may be inaccurate for
        larger amounts, or for benzos with different effect profiles. Compare
        the dose ranges below, and start lower than the converter shows:
        everybody reacts differently to different substances.
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <BenzoInfo label="You have" benzo={from} />
        <BenzoInfo label="Converting to" benzo={to} />
      </div>
    </>
  );
}
