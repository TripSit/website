import { Fragment } from "react";
import { parseReagentResults, type ReagentColour } from "../utils/reagents";

// Approximate test colours. The written result stays next to them: the swatches are a guide,
// not a reference chart, and screen readers skip them.
const swatches: Record<ReagentColour, string> = {
  none: "transparent",
  purple: "#6b2fa0",
  violet: "#8a4fd8",
  brown: "#7b4a1e",
  black: "#111111",
  yellow: "#f4d03f",
  green: "#2e9b4f",
  blue: "#2c64c9",
  orange: "#ef8a1f",
  red: "#c62828",
  pink: "#ec6fa8",
};

function Swatch({ colour }: Readonly<{ colour: ReagentColour }>) {
  return (
    <span
      data-colour={colour}
      className={`inline-block h-3 w-3 rounded-full border align-middle ${
        colour === "none" ? "border-dashed border-gray-500" : "border-black/30"
      }`}
      style={{ backgroundColor: swatches[colour] }}
    />
  );
}

export default function ReagentResults({ text }: Readonly<{ text?: string }>) {
  const results = parseReagentResults(text);
  if (results.length === 0) return null;
  return (
    <ul className="m-0 grid list-none gap-1 p-0">
      {results.map(({ key, reagent, result, stages }) => (
        <li key={key} className="flex flex-wrap items-center gap-x-2">
          <span aria-hidden="true" className="inline-flex items-center gap-1">
            {stages.map(({ key: stageKey, colours }, step) => (
              <Fragment key={stageKey}>
                {step > 0 && <span className="text-xs">→</span>}
                {colours.map((colour) => (
                  <Swatch key={colour} colour={colour} />
                ))}
              </Fragment>
            ))}
          </span>
          <span>
            {reagent && <strong>{reagent}: </strong>}
            {result}
          </span>
        </li>
      ))}
    </ul>
  );
}
