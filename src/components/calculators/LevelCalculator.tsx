import { useMemo, useState, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import type { ApexAxisChartSeries, ApexOptions } from "apexcharts";
import { solidButton } from "../buttonClasses";
import { cardClass, fieldClass } from "./CalculatorPage";
import {
  calculateLevels,
  keepDecimal,
  keepDigits,
  MAX_LEVEL,
  totalXpForLevel,
  type StartFrom,
  type XpAmount,
} from "./levelData";

// ApexCharts needs the browser, so it only loads there.
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Site colours (src/styles/tailwind.css); the chart needs them as values.
const COLOURS = {
  night: "#0b0e1a",
  line: "#2a3152",
  mute: "#9aa3c7",
  violet: "#a06bff",
  cyan: "#46d8ec",
  amber: "#f2b94b",
};

const wholeNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
const oneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

// The chart shows levels 1 to 100, or further when a marked level is higher.
export function chartLevels(currentLevel: number, desiredLevel: number) {
  const highest = Math.max(100, currentLevel, desiredLevel);
  return Math.min(MAX_LEVEL, Math.ceil(highest / 10) * 10);
}

function marker(level: number, text: string, colour: string) {
  return {
    x: level,
    y: totalXpForLevel(level),
    marker: {
      size: 6,
      fillColor: colour,
      strokeColor: COLOURS.night,
      strokeWidth: 2,
    },
    label: {
      text,
      borderColor: colour,
      style: { background: colour, color: COLOURS.night, fontWeight: 600 },
    },
  };
}

export function levelChart(
  currentLevel: number,
  desiredLevel: number,
): { series: ApexAxisChartSeries; options: ApexOptions } {
  const levels = chartLevels(currentLevel, desiredLevel);
  // Level 0 is off the chart, and 0 also means "no level entered".
  const points = [
    ...(currentLevel > 0
      ? [marker(currentLevel, `Now: ${currentLevel}`, COLOURS.cyan)]
      : []),
    ...(desiredLevel > 0
      ? [marker(desiredLevel, `Goal: ${desiredLevel}`, COLOURS.amber)]
      : []),
  ];
  return {
    series: [
      {
        name: "Total XP",
        data: Array.from({ length: levels }, (_, index) => [
          index + 1,
          totalXpForLevel(index + 1),
        ]),
      },
    ],
    options: {
      chart: {
        background: "transparent",
        foreColor: COLOURS.mute,
        fontFamily: "inherit",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: false },
      },
      theme: { mode: "dark" },
      colors: [COLOURS.violet],
      stroke: { curve: "straight", width: 3 },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: COLOURS.line },
      annotations: { points },
      xaxis: {
        type: "numeric",
        min: 1,
        max: levels,
        tickAmount: 10,
        title: { text: "Level" },
        tooltip: { enabled: false },
        labels: { formatter: (value) => wholeNumber.format(Number(value)) },
      },
      yaxis: {
        title: { text: "Total XP" },
        labels: { formatter: (value) => compact.format(value) },
      },
      tooltip: {
        theme: "dark",
        x: { formatter: (value) => `Level ${value}` },
        // null is a gap in the data, which this chart doesn't have
        y: {
          formatter: (value) =>
            value === null ? "" : `${wholeNumber.format(value)} XP`,
        },
      },
    },
  };
}

function XpCard({
  title,
  label,
  amount,
}: Readonly<{ title: string; label: string; amount: XpAmount }>) {
  return (
    <section className={cardClass} aria-label={title}>
      <h2 className="mb-0 mt-0 font-display text-xl font-semibold text-ink">
        {title}
      </h2>
      <p className="mb-0 mt-2 break-words text-2xl font-semibold text-cyan md:text-3xl">
        <output aria-label={`XP ${label}`}>
          {wholeNumber.format(amount.xp)}
        </output>{" "}
        XP
      </p>
      <p className="mb-0 mt-2 text-base leading-relaxed text-mute">
        About{" "}
        <output aria-label={`Messages ${label}`} className="text-ink">
          {wholeNumber.format(amount.messages)}
        </output>{" "}
        messages, or{" "}
        <output aria-label={`Voice hours ${label}`} className="text-ink">
          {oneDecimal.format(amount.voiceHours)}
        </output>{" "}
        hours in voice chat
      </p>
    </section>
  );
}

const MODES: { value: StartFrom; label: string }[] = [
  { value: "level", label: "My level" },
  { value: "activity", label: "My messages and voice time" },
];

// Room for a million messages or hours
const wideFieldClass = fieldClass.replace("w-24", "w-32");

const toggleClass =
  "rounded-full border-[1px] border-solid px-6 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

export default function LevelCalculator() {
  const [startFrom, setStartFrom] = useState<StartFrom>("level");
  const [currentLevel, setCurrentLevel] = useState("");
  const [messages, setMessages] = useState("");
  const [voiceHours, setVoiceHours] = useState("");
  const [desiredLevel, setDesiredLevel] = useState("");

  const result = calculateLevels({
    startFrom,
    currentLevel,
    messages,
    voiceHours,
    desiredLevel,
  });
  // A new options object redraws the chart, so only make one when a marker moves.
  const chart = useMemo(
    () => levelChart(result.currentLevel, result.desiredLevel),
    [result.currentLevel, result.desiredLevel],
  );

  function typed(
    setter: (value: string) => void,
    filter: (text: string) => string,
  ) {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setter(filter(event.target.value));
  }
  const levelFilter = (text: string) => keepDigits(text, 4);

  return (
    <div className="grid gap-6">
      <div className={`${cardClass} flex flex-col gap-6 text-lg text-ink`}>
        <div
          role="group"
          aria-label="Work out your XP from"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-mute">Start from:</span>
          {MODES.map((mode) => {
            const pressed = startFrom === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                aria-pressed={pressed}
                className={
                  pressed
                    ? `${toggleClass} ${solidButton} border-cyan bg-cyan`
                    : `${toggleClass} border-line bg-transparent text-ink hover:border-cyan`
                }
                onClick={() => setStartFrom(mode.value)}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {startFrom === "level" ? (
          <div>
            <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-3">
              <span>I&apos;m level</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                aria-label="Your current level"
                className={fieldClass}
                value={currentLevel}
                onChange={typed(setCurrentLevel, levelFilter)}
              />
            </p>
            <p className="mb-0 mt-2 text-sm text-mute">
              Use <code className="text-cyan">/levels</code> in the TripSit
              Discord to see your level.
            </p>
          </div>
        ) : (
          <div>
            <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-3">
              <span>I&apos;ve sent</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                aria-label="Messages sent"
                className={wideFieldClass}
                value={messages}
                onChange={typed(setMessages, (text) => keepDigits(text, 7))}
              />
              <span>messages and spent</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                aria-label="Hours in voice chat"
                className={wideFieldClass}
                value={voiceHours}
                onChange={typed(setVoiceHours, (text) => keepDecimal(text, 9))}
              />
              <span>hours in voice chat.</span>
            </p>
            {result.estimate && (
              <p className="mb-0 mt-2 text-sm text-mute">
                That&apos;s about{" "}
                <output aria-label="Estimated XP so far" className="text-ink">
                  {wholeNumber.format(result.estimate.xp)}
                </output>{" "}
                XP, which is level{" "}
                <output
                  aria-label="Estimated current level"
                  className="text-ink"
                >
                  {result.estimate.level}
                </output>
                .
              </p>
            )}
          </div>
        )}

        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-3">
          <span>I want to reach level</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            aria-label="Level you want to reach"
            className={fieldClass}
            value={desiredLevel}
            onChange={typed(setDesiredLevel, levelFilter)}
          />
        </p>

        {result.warning && (
          <p
            role="alert"
            className="m-0 rounded-xl border-[1px] border-solid border-amber/50 bg-amber/10 px-4 py-3 text-base text-ink"
          >
            {result.warning}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <XpCard
          title="Still needed"
          label="still needed"
          amount={result.left}
        />
        <XpCard
          title="Total from level 0"
          label="in total"
          amount={result.total}
        />
      </div>

      <section className={cardClass} aria-label="XP chart">
        <h2 className="mb-0 mt-0 font-display text-xl font-semibold text-ink">
          Total XP for each level
        </h2>
        <p className="mb-0 mt-2 text-sm text-mute">
          Your current level and the one you want are marked on the line.
        </p>
        <div className="mt-6 h-[320px]">
          <ReactApexChart
            type="line"
            height={320}
            width="100%"
            series={chart.series}
            options={chart.options}
          />
        </div>
      </section>
    </div>
  );
}
