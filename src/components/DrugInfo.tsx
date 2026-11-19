import React, { memo, ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Dosage, Dose, Drug, Duration, Interactions } from "tripsit_drug_db";
import type { ApexAxisChartSeries } from "apexcharts";
import dynamic from "next/dynamic";
import Link from "next/link";
import comboDefinitions from "../assets/comboDefinitions.json";
import { SUBSTANCES } from "./comboChecker/comboData";
import addDictionaryDefs from "./addDictionaryDefs";
import ReagentResults from "./ReagentResults";
import { parseDoseRangeMg } from "../utils/parseDoseRangeMg";

// We need to dynamically load this module
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type TimingKey = "Onset" | "Duration" | "After Effects";

// All numbers are in hours, including minutes (30 mins = .5 hours)
type TimingWindow = {
  min: number;
  max: number;
  startTime: number;
  endTime: number;
};

// Keyed by ROA, eg "Oral"
type DurationTiming = {
  [roa: string]: Partial<Record<TimingKey, TimingWindow>>;
};

// Each phase starts once the one before it is underway: Duration follows Onset,
// and After Effects follows Duration.
const PREVIOUS_PHASE: Record<TimingKey, TimingKey | undefined> = {
  Onset: undefined,
  Duration: "Onset",
  "After Effects": "Duration",
};

const round2 = (value: number) => Number.parseFloat(value.toFixed(2));

// Pulls the min and max hours out of a string like "1-2", "30" or "1.5-3hours".
// If there is no dash, the single number is the max and the min is 0.
function parseRangeHours(
  text: string,
  unit: string | undefined,
): { min: number; max: number } | undefined {
  const match = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/.exec(text);
  if (!match) {
    return undefined;
  }
  const divisor = unit === "minutes" ? 60 : 1;
  const max = Number.parseFloat(match[2] ?? match[1]) / divisor;
  const min = match[2] ? Number.parseFloat(match[1]) / divisor : 0;
  return { min, max };
}

// Places a phase on the timeline: right after the previous phase when we know it,
// otherwise on its own (Onset always starts at 0).
function placeWindow(
  timingKey: TimingKey,
  range: { min: number; max: number },
  previous: TimingWindow | undefined,
): Pick<TimingWindow, "startTime" | "endTime"> {
  if (previous) {
    return {
      startTime: previous.startTime + previous.min,
      endTime: previous.startTime + previous.max + round2(range.max),
    };
  }
  return {
    startTime: timingKey === "Onset" ? 0 : round2(range.min),
    endTime: round2(range.max),
  };
}

const PHASES: TimingKey[] = ["Onset", "Duration", "After Effects"];

// Route keys like "Oral_MAOI" read as "Oral (MAOI)".
function routeLabel(route: string): string {
  const [base, ...detail] = route.split("_");
  return detail.length > 0 ? `${base} (${detail.join(" ")})` : base;
}

// Hours as text: 0.25 is "15m", 3 is "3h", 1.5 is "1h 30m", and 0 stays "0".
function formatHours(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes === 0) {
    return "0";
  }
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (wholeHours === 0) {
    return `${minutes}m`;
  }
  return minutes ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
}

// The ROA keys a phase names, or undefined when the phase is one "value" for every ROA.
function namedRoutes(timingData: Duration): string[] | undefined {
  if (timingData.value !== undefined) {
    return undefined;
  }
  return Object.keys(timingData).filter((key) => key !== "_unit");
}

// Adds one phase (onset, duration or after effects) to each route's timeline.
// A phase given as a single "value" names no route. The factsheet text gives those values
// for the drug as a whole (eg 2C-B's after effects are "2-4 hours" whichever way it was
// taken), so it goes on every route the other phases name.
function addDurationData(
  timingData: Duration,
  timingKey: TimingKey,
  timingObject: DurationTiming,
  allRoutes: string[],
): DurationTiming {
  const value = timingData.value;
  const roaEntries: [string, string][] =
    value === undefined
      ? (namedRoutes(timingData) ?? []).map((roa) => [
          roa,
          timingData[roa as keyof Duration] as string,
        ])
      : allRoutes.map((roa) => [roa, value]);

  const durationTiming = timingObject;
  const previousPhase = PREVIOUS_PHASE[timingKey];

  for (const [roa, roaString] of roaEntries) {
    const range = parseRangeHours(roaString, timingData._unit);
    if (!range) {
      continue;
    }

    const route = routeLabel(roa);
    const previous = previousPhase
      ? durationTiming[route]?.[previousPhase]
      : undefined;

    durationTiming[route] = {
      ...durationTiming[route],
      [timingKey]: {
        min: round2(range.min),
        max: round2(range.max),
        ...placeWindow(timingKey, range, previous),
      },
    };
  }

  return durationTiming;
}

const addDurations = (drugData: Drug) => {
  const phaseData: [TimingKey, Duration | undefined][] = [
    ["Onset", drugData.formatted_onset],
    ["Duration", drugData.formatted_duration],
    ["After Effects", drugData.formatted_aftereffects],
  ];

  // Every route any phase names, in the order they first appear. When no phase names one,
  // the values are filed under "Oral".
  const named = [
    ...new Set(
      phaseData.flatMap(([, data]) => (data ? (namedRoutes(data) ?? []) : [])),
    ),
  ];
  const allRoutes = named.length > 0 ? named : ["Oral"];

  // Build each route's timeline phase by phase, so each phase can start after the one
  // before it on the same route.
  let durationTiming = {} as DurationTiming;
  for (const [timingKey, data] of phaseData) {
    if (data) {
      durationTiming = addDurationData(
        data,
        timingKey,
        durationTiming,
        allRoutes,
      );
    }
  }

  const routes = Object.keys(durationTiming);
  const phases = PHASES.filter((phase) =>
    routes.some((route) => durationTiming[route][phase]),
  );

  // One series per phase, with a bar for each route that has it, so the legend lists each
  // phase once and a phase is the same colour on every row.
  const durationSeries = phases.map((phase) => ({
    name: phase,
    data: routes.flatMap((route) => {
      const timing = durationTiming[route][phase];
      if (!timing) {
        return [];
      }
      return [
        {
          x: route,
          y: [timing.startTime, timing.endTime],
          goals: [
            // The black line that signifies the minimum duration
            {
              name: "Minimum",
              value: timing.min + timing.startTime,
              strokeWidth: 2,
              strokeColor: "#000000",
            },
          ] as Record<string, unknown>[],
        },
      ];
    }),
  })) as ApexAxisChartSeries;

  // Create chart options
  const option = {
    chart: {
      id: "durationChart",
      // The grow-in animation keeps the browser drawing frames for about two seconds after a
      // factsheet row is expanded. Draw the chart once instead.
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
        // rangeBarGroupRows: false,
        rangeBarOverlap: true,
      },
    },
    // colors: doseColors,
    fill: {
      type: "gradient",
      gradient: {
        type: "horizontal",
        // gradientToColors: doseGradientToColors,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.5,
      },
    },
    xaxis: {
      type: "numeric" as const,
      min: 0,
      forceNiceScale: false,
    },
    tooltip: {
      custom: ({
        seriesIndex,
        dataPointIndex,
        w,
      }: {
        seriesIndex: number;
        dataPointIndex: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        w: any;
      }) => {
        const series = w.config.series[seriesIndex];
        const route = series.data[dataPointIndex].x as string;
        const phase = series.name as TimingKey;
        const routeTiming = durationTiming[route];
        const periodData = routeTiming[phase] as TimingWindow;

        // Matches placeWindow: a phase follows the one before it on the same route.
        const previous = PREVIOUS_PHASE[phase];
        const action =
          previous && routeTiming[previous] ? `${previous} ends` : "dosing";

        return `<div class="apexcharts-tooltip-rangebar"><div>
          <span class="Type">${route} ${phase}</span><br>
          <span class="value start-value">Lasts ${formatHours(periodData.min)}</span>
          <span class="separator">-</span>
          <span class="value end-value">${formatHours(periodData.max)} after ${action}.</span></div></div>`;
      },
    },
  };

  // Determine how many columns we need for the grid
  const gridSpacing = Math.max(12 / (phases.length + 1), 2); // Ensure a minimum size for the grid

  return (
    <Grid size={{ xs: 12 }} key="durations">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Duration Chart */}
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "black" }}
              >
                Durations
              </Typography>
              <ReactApexChart
                type="rangeBar" // This allows us to have floating bars
                options={option}
                series={durationSeries}
                // Room for every route's label once there are more than four rows.
                height={Math.max(200, 72 + routes.length * 32)}
                width="100%"
              />
            </Grid>

            {/* Duration Text */}
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <div style={{ height: "48px" }}></div>
              <Grid container spacing={0}>
                {/* Strength Headers */}
                <Grid size={{ xs: gridSpacing }}>
                  <Typography></Typography>
                </Grid>
                {phases.map((phase) => (
                  <Grid size={{ xs: gridSpacing }} key={phase}>
                    <Typography>{phase}</Typography>
                  </Grid>
                ))}

                {/* Duration Rows. A phase a route lacks keeps an empty cell, so later
                    values stay under their own heading. */}
                {routes.map((route) => (
                  <React.Fragment key={route}>
                    <Grid size={{ xs: gridSpacing }}>
                      <Typography>
                        <b>{route}</b>
                      </Typography>
                    </Grid>
                    {phases.map((phase) => {
                      const timing = durationTiming[route][phase];
                      return (
                        <Grid
                          size={{ xs: gridSpacing }}
                          key={`${route}-${phase}`}
                        >
                          {timing && (
                            <Typography>
                              {formatHours(timing.min)} to{" "}
                              {formatHours(timing.max)}
                            </Typography>
                          )}
                        </Grid>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

// Dose levels from weakest to strongest. The dosage table's columns and the chart's legend
// follow this order, whichever route happens to list a level first.
const DOSE_ORDER = [
  "Threshold",
  "Light",
  "Common",
  "Strong",
  "Heavy",
  "Dangerous",
  "Fatal",
];

// Levels not in DOSE_ORDER go after the known ones, in the order they came.
const doseRank = (strength: string) => {
  const rank = DOSE_ORDER.indexOf(strength);
  return rank === -1 ? DOSE_ORDER.length : rank;
};
const byDoseOrder = (a: string, b: string) => doseRank(a) - doseRank(b);

// This takes the dosage data and makes a nice table out of it
const addDosages = (drugData: Drug) => {
  const doseData = drugData.formatted_dose as Dose;
  const doseColorData = {
    Threshold: "#6DDF6D",
    Light: "#A8E05F",
    Common: "#FFD966",
    Strong: "#FFB347",
    Heavy: "#FF8C42",
    Dangerous: "#FF6347",
    Fatal: "#D63131",
  };

  const doseGradientData = {
    Threshold: "#8EEB63",
    Light: "#C1E75B",
    Common: "#FFC04C",
    Strong: "#FFA94D",
    Heavy: "#FF7A45",
    Dangerous: "#FF6347",
    Fatal: "#D63131",
  };

  // This will be used by apexcharts to create the chart
  const doseSeries = [] as ApexAxisChartSeries;
  // This is used to show the text on the side of the chart
  const doseText = {} as {
    [roa: string]: {
      [strength: string]: string;
    };
  };

  // Go through each ROA
  for (const roa of Object.keys(doseData)) {
    const roaData = doseData[roa as keyof typeof doseData] as Dosage;

    const sortedKeys = Object.keys(roaData).sort(byDoseOrder);

    // For each strength in the ROA
    for (const strength of sortedKeys) {
      const strengthData = roaData[strength as keyof typeof roaData] as string;

      // Add the text to the doseText object so we can print it out later
      doseText[roa] = {
        ...doseText[roa],
        [strength]: strengthData,
      };

      const range = parseDoseRangeMg(strengthData);
      if (!range) continue;

      const point = { x: `${roa} (mg)`, y: range };
      const existingSeries = doseSeries.find(
        (series) => series.name === strength,
      );
      if (existingSeries) {
        (existingSeries.data as (typeof point)[]).push(point);
        continue;
      }

      doseSeries.push({ name: strength, data: [point] });
    }
  }

  // A series starts with the first route that has its level, so DMT's Threshold (only
  // vaporized lists one) came after Strong. Put them back in dose order, and colour each
  // series by its level.
  doseSeries.sort((a, b) =>
    byDoseOrder(String(a.name ?? ""), String(b.name ?? "")),
  );
  const doseColors = doseSeries.map(
    ({ name }) => doseColorData[name as keyof typeof doseColorData],
  );
  const doseGradientToColors = doseSeries.map(
    ({ name }) => doseGradientData[name as keyof typeof doseGradientData],
  );

  const option = {
    chart: {
      id: "doseChart",
      animations: { enabled: false }, // See the duration chart above
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        rangeBarGroupRows: true,
      },
    },
    colors: doseColors,
    fill: {
      type: "gradient",
      gradient: {
        type: "horizontal",
        gradientToColors: doseGradientToColors,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
      },
    },
    xaxis: {
      min: 0,
      // Rows otherwise follow the first series, so the route with the lowest level would
      // jump to the top. Keep the table's route order.
      categories: Object.keys(doseText)
        .map((roa) => `${roa} (mg)`)
        .filter((row) =>
          doseSeries.some((series) =>
            (series.data as { x: string }[]).some(({ x }) => x === row),
          ),
        ),
    },
    tooltip: {
      custom: ({
        seriesIndex,
        dataPointIndex,
        w,
      }: {
        seriesIndex: number;
        dataPointIndex: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        w: any;
      }) => {
        const s = w.config.series[seriesIndex].data[dataPointIndex];

        const yStartValue = s.y[0];
        const yEndValue = s.y[1];

        return `<div class="apexcharts-tooltip-rangebar"><div>
          <span class="Type">${w.config.series[seriesIndex].name}: </span><br>
          <span class="category">${s.x}: </span>
          <span class="value start-value">${yStartValue}</span>
          <span class="separator">-</span>
          <span class="value end-value">${yEndValue}</span></div></div>`;
      },
    },
  };

  const uniqueStrengths = new Set<string>();

  for (const roa of Object.values(doseText)) {
    for (const strength of Object.keys(roa)) {
      uniqueStrengths.add(strength);
    }
  }

  const allStrengths = [...uniqueStrengths].sort(byDoseOrder);
  const gridSpacing = Math.max(12 / (allStrengths.length + 1), 2); // Ensure a minimum size for the grid

  return (
    <Grid size={{ xs: 12 }} key="dosage">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Dosage Chart */}
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "black" }}
              >
                Dosages
              </Typography>
              {doseSeries.length > 0 && (
                <>
                  <Typography variant="body2">
                    Chart shows bounded mass ranges in mg. See the table for all
                    doses.
                  </Typography>
                  <ReactApexChart
                    type="rangeBar"
                    options={option}
                    series={doseSeries}
                    height={200}
                    width="100%"
                  />
                </>
              )}
            </Grid>

            {/* Dosage Text */}
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <div style={{ height: "48px" }}></div>
              <Grid container spacing={0}>
                {/* Strength Headers */}
                <Grid size={{ xs: gridSpacing }}>
                  <Typography></Typography>
                </Grid>
                {allStrengths.map((strength) => (
                  <Grid size={{ xs: gridSpacing }} key={strength}>
                    <Typography
                      style={{
                        backgroundColor:
                          doseColorData[strength as keyof typeof doseColorData],
                      }}
                    >
                      {strength}
                    </Typography>
                  </Grid>
                ))}

                {/* ROA Rows */}
                {Object.keys(doseText).map((roa) => (
                  <React.Fragment key={roa}>
                    <Grid size={{ xs: gridSpacing }}>
                      <Typography>
                        <b>{roa}</b>
                      </Typography>
                    </Grid>
                    {allStrengths.map((strength) => (
                      <Grid
                        size={{ xs: gridSpacing }}
                        key={`${roa}-${strength}`}
                      >
                        <Typography
                          style={{
                            backgroundColor:
                              doseColorData[
                                strength as keyof typeof doseColorData
                              ],
                          }}
                        >
                          {doseText[roa][strength] || "-"}
                        </Typography>
                      </Grid>
                    ))}
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

// PsychonautWiki page names use underscores for spaces, and a "#" in a name links to a
// section ("Visual disconnection#Structures"), so encodeURI rather than encodeURIComponent.
function psychonautWikiUrl(name: string): string {
  return encodeURI(
    `https://psychonautwiki.org/wiki/${name.replaceAll(" ", "_")}`,
  );
}

// Shown above the other cards, in this order, with these headings.
const importantProperties = [
  "warning",
  "avoid",
  "contraindications",
  "risks",
  "adverseEffects",
] as const;
const warningLabels: Record<(typeof importantProperties)[number], string> = {
  warning: "Warning",
  avoid: "Avoid",
  contraindications: "Contraindications",
  risks: "Risks",
  adverseEffects: "Adverse effects",
};

function WarningCard({
  label,
  text,
}: Readonly<{ label: string; text: string }>) {
  return (
    <Card sx={{ backgroundColor: "#fdecea", borderLeft: "6px solid #b3261e" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: "#8c1d18",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningAmberIcon aria-hidden="true" />
          {label}
        </Typography>
        <Typography sx={{ color: "black", whiteSpace: "pre-line" }}>
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

// Most to least risky. A drug's combination with itself ("Self") is never shown.
const comboOrder = [
  "Dangerous",
  "Unsafe",
  "Caution",
  "Low Risk & Synergy",
  "Low Risk & No Synergy",
  "Low Risk & Decrease",
];

const comboColors: Record<string, { background: string; border: string }> = {
  Dangerous: { background: "#fdc9cc", border: "#7f0006" },
  Unsafe: { background: "#ffe6cb", border: "#873100" },
  Caution: { background: "#fffacb", border: "#827700" },
  "Low Risk & Synergy": { background: "#cbf0d1", border: "#077c1b" },
  "Low Risk & No Synergy": { background: "#dfd3ec", border: "#3d166c" },
  "Low Risk & Decrease": { background: "#d8effe", border: "#00426c" },
};

// Spell substances the way the combination checker and chart do (MAOIs, 5-MeO-xxT, DOx);
// anything they don't list is title-cased.
const checkerNames = new Map(
  SUBSTANCES.map((name) => [name.toLowerCase(), name]),
);
const acronyms = new Set(["amt", "pcp"]);

function comboLabel(key: string): string {
  const known = checkerNames.get(key.toLowerCase());
  if (known) return known;
  if (acronyms.has(key.toLowerCase())) return key.toUpperCase();
  return key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type ComboEntry = { name: string; note: string };

function ComboGroup({
  status,
  combos,
}: Readonly<{ status: string; combos: ComboEntry[] }>) {
  const colors = comboColors[status];
  const definition = comboDefinitions.find((combo) => combo.status === status);
  return (
    <Box
      component="section"
      sx={{
        mt: 2,
        p: 1.5,
        borderRadius: 1,
        borderLeft: `6px solid ${colors.border}`,
        backgroundColor: colors.background,
        color: "black",
      }}
    >
      <Typography
        variant="h6"
        component="h3"
        sx={{ color: "black", fontWeight: 700 }}
      >
        <span aria-hidden="true">{definition?.emoji}</span> {status} (
        {combos.length})
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {definition?.definition}
      </Typography>
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            // The same name column in every group, wide enough for "Dextromethorphan".
            sm: "11rem 1fr",
          },
          columnGap: 3,
          rowGap: { xs: 0.25, sm: 1 },
        }}
      >
        {combos.map(({ name, note }) => (
          <React.Fragment key={name}>
            <Box component="dt" sx={{ fontWeight: 700, mt: { xs: 1, sm: 0 } }}>
              {name}
            </Box>
            <Box component="dd" sx={{ m: 0 }}>
              {note}
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

// The "Known Combinations" card: every combination grouped by risk, most risky first, each
// group with its colour and definition. Empty groups are left out.
function comboCard(comboData: Interactions): React.JSX.Element {
  const groups = new Map<string, ComboEntry[]>(
    comboOrder.map((status) => [status, []]),
  );
  for (const [drugB, combo] of Object.entries(comboData)) {
    if (!combo) continue;
    groups.get(combo.status)?.push({
      name: comboLabel(drugB),
      // Notes are shown as written; only stray double spaces are tidied.
      note: (combo.note ?? "").replaceAll(/ {2,}/g, " ").trim(),
    });
  }

  return (
    <Grid size={{ xs: 12 }} key="combos">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" style={{ color: "black" }}>
            Known Combinations
          </Typography>
          <Typography>
            Combination information is sourced from our{" "}
            <a
              href="https://github.com/TripSit/drugs"
              target="_blank"
              rel="noopener noreferrer"
            >
              drug database
            </a>
            . Sources can be found on our{" "}
            <a
              href="https://wiki.tripsit.me/wiki/Drug_combinations"
              target="_blank"
              rel="noopener noreferrer"
            >
              wiki
            </a>
            . The nice combo chart can be found on{" "}
            <Link href="/combo">tripsit.me/combo</Link>
            {"."}
          </Typography>
          {comboOrder.map((status) => {
            const combos = groups.get(status) ?? [];
            return combos.length > 0 ? (
              <ComboGroup key={status} status={status} combos={combos} />
            ) : null;
          })}
        </CardContent>
      </Card>
    </Grid>
  );
}

// One card for each remaining property; the ones shown elsewhere are skipped.
function propertyCards(properties: Drug["properties"]): React.JSX.Element[] {
  const elements = [] as React.JSX.Element[];
  for (const property of Object.keys(properties)) {
    const duplicatedProperties: string[] = [
      ...importantProperties,
      "name",
      "summary",
      "categories",
      "aliases",
      "afterEffects",
      "dose",
      "duration",
      "onset",
      "effects",
      "after-effects",
      "pweffects",
      "combos",
      "sources",
      "links",
    ];
    if (duplicatedProperties.includes(property)) {
      continue;
    }
    const propertyName = property.replaceAll("_", " ");
    const propertyValue = properties[property as keyof typeof properties];
    if (propertyName === "test-kits") {
      elements.push(
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={propertyName}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "black" }}
              >
                Reagent test results
              </Typography>
              <Typography component="div">
                <ReagentResults text={propertyValue as string} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>,
      );
    } else if (propertyName === "experiences") {
      elements.push(
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={propertyName}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "black" }}
              >
                {propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
              </Typography>
              <Typography>
                <a
                  href={propertyValue as string}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Erowid Experience Vault
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>,
      );
    } else {
      elements.push(
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={propertyName}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "black" }}
              >
                {propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
              </Typography>
              <Typography>{propertyValue}</Typography>
            </CardContent>
          </Card>
        </Grid>,
      );
    }
  }
  return elements;
}

function DrugInfoCard({ drugData }: Readonly<{ drugData: Drug }>): ReactNode {
  // This function goes through all the optional data in the drug and creates a nice and fancy expandable row

  // This is the array that will hold all the elements that will be displayed in the expanded row
  const elements = [] as React.JSX.Element[];
  const properties = drugData.properties ?? {};

  // Safety notes come first, each in its own warning card.
  for (const property of importantProperties) {
    const text = properties[property as keyof typeof properties];
    if (typeof text === "string" && text.trim()) {
      elements.push(
        <Grid size={{ xs: 12 }} key={`${drugData.name}-${property}`}>
          <WarningCard label={warningLabels[property]} text={text} />
        </Grid>,
      );
    }
  }

  // Always push the drug name since it's the one required field
  elements.push(
    <Grid size={{ xs: 12, sm: 4, md: 4 }} key="pretty_name">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" style={{ color: "black" }}>
            Chemical Name
          </Typography>
          <Typography>{drugData.pretty_name}</Typography>
        </CardContent>
      </Card>
    </Grid>,
  );

  if (drugData.aliases) {
    elements.push(
      <Grid size={{ xs: 12, sm: 4, md: 4 }} key="aliases">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Aliases
            </Typography>
            <Typography>{drugData.aliases.join(", ")}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.categories) {
    // Take the category list, capitalize each word, and join them with commas

    const capitalizedCategories = drugData.categories
      .map(
        (category) =>
          category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      )
      .join(", ");
    elements.push(
      <Grid size={{ xs: 12, sm: 4, md: 4 }} key={`${drugData.name} categories`}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Categories
            </Typography>
            <Typography>{addDictionaryDefs(capitalizedCategories)}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (properties.summary) {
    // Take the category list, capitalize each word, and join them with commas

    elements.push(
      <Grid size={{ xs: 12, sm: 12, md: 12 }} key="summary">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Summary
            </Typography>
            <Typography>{addDictionaryDefs(properties.summary)}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  elements.push(...propertyCards(properties));

  // Dose note comes before dosage
  if (drugData.dose_note) {
    elements.push(
      <Grid size={{ xs: 12, sm: 12, md: 12 }} key="dose_note">
        <Card>
          <CardContent sx={{ backgroundColor: "yellow" }}>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Dosage Note
            </Typography>
            <Typography>{drugData.dose_note}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.formatted_dose) {
    elements.push(addDosages(drugData));
  }

  if (
    drugData.formatted_onset ||
    drugData.formatted_duration ||
    drugData.formatted_aftereffects
  ) {
    elements.push(addDurations(drugData));
  }

  if (drugData.combos) {
    elements.push(comboCard(drugData.combos));
  }

  if (drugData.pweffects !== undefined) {
    elements.push(
      <Grid size={{ xs: 12, sm: 12, md: 12 }} key="pweffects">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Psychonaut Wiki Effects
            </Typography>
            <Grid container spacing={1}>
              {Object.keys(drugData.pweffects).map((property) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={property}>
                  <Typography>
                    <a
                      href={psychonautWikiUrl(property)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {property}
                    </a>
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.formatted_effects) {
    elements.push(
      <Grid size={{ xs: 12, sm: 6, md: 6 }} key="effects">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Effects
            </Typography>
            <Typography>{drugData.formatted_effects.join(", ")}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.links) {
    const linkData = drugData.links;
    const linkKeys = Object.keys(drugData.links);

    elements.push(
      <Grid size={{ xs: 12, sm: 6, md: 6 }} key="links">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Links
            </Typography>
            {linkKeys.map((property) => (
              <Typography key={property}>
                <a
                  href={linkData[property as keyof typeof linkData]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {property.charAt(0).toUpperCase() + property.slice(1)}
                </a>
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.sources) {
    const sourceData = drugData.sources;
    const links = Object.values(sourceData);
    elements.push(
      <Grid size={{ xs: 12, sm: 6, md: 6 }} key="sources">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ color: "black" }}>
              Sources
            </Typography>
            <Typography>{links}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  return (
    <Container
      maxWidth="lg"
      // The site-wide link blue (#2487ce) is 3.9:1 on these white cards; this is 4.9:1.
      sx={{ "& a:not([class])": { color: "#1f75b3" } }}
    >
      <Grid container spacing={2}>
        {elements}
      </Grid>
    </Container>
  );
}

// The factsheets table re-renders on every state change (each keystroke in a filter, for
// example) and asks for the detail panel of every row each time. Without memo, an open card
// re-renders too, and react-apexcharts treats the fresh options object (its tooltip functions
// never compare equal) as a change and redraws both charts from scratch.
export default memo(DrugInfoCard);
