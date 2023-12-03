/* eslint-disable no-underscore-dangle */ // We use this because we have the _unit property
/* eslint-disable no-console */ // For debugging
/* eslint-disable sonarjs/no-duplicate-string */ // Make things easier to read

/* Welcome Developers to TripSit's Factsheets, brought to you by THC and spite. 

This is a React component displays data from the TripSit drug database : https://github.com/tripsit/drugs

If you want to modify the /information/ on this page, you need to modify the above drug database.
Check out that repo and make a new issue/pull request there, and this page will pull in that information.

If you want to modify the /layout/ of this page, you need to modify this file.
It's hosted within the greater TripSit website project: https://github.com/tripsit/website
It displays the data using material react table: https://www.material-react-table.com
It creates charts using ApexCharts: https://apexcharts.com/
Pull requests are welcome! If you have any questions, feel free to ask in #dev on the TripSit Discord: https://discord.gg/tripsit

Launch List:

Combo formatting
Sources formatting
Update definitions

With List:
Add dark mode? / theme https://mui.com/material-ui/customization/default-theme/
Add elevated/drop shadow stuff per rooni - https://discord.com/channels/179641883222474752/1052608066085978213/1179249353936867398
Pinning new drugs
DMT durations are messed up
DMT is missing dosages
Fix when the density is changed
*/

import React, { ReactNode, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_Row,
} from "material-react-table";
import {
  IconButton,
  Tooltip,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { Accordion, AccordionItem } from "@nextui-org/react";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"; // note: this is TanStack Rea`ct Query V5
import { Category, Drug, Dose, Dosage, Duration } from "tripsit_drug_db";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Grid from "@mui/material/Grid";
import KofiButton from "kofi-button";
import dynamic from "next/dynamic";
import UnfoldMoreDoubleIcon from "@mui/icons-material/UnfoldMoreDouble";
import UnfoldLessDoubleIcon from "@mui/icons-material/UnfoldLessDouble";
import PatreonButton from "./Patreon";

import dictionary from "../assets/dictionary.json";
import GithubButton from "./Github";

// If you want to debug a specific drug, change the below variable to the name of the drug
// and then use the commented-out code below that to display what you need to debug
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugDrug = "1,4-butanediol";
// if (drugData.original.name === debugDrug) {
//   console.log(`roaString: ${JSON.stringify(roaString, null, 2)}`);
// }

// We need to dynamically load this module
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// This appears at the top and can contain any information you want
// We can use this for announcements or updates
const InfoBar = (
  // We use the accordion item to make it collapsible
  <Accordion>
    <AccordionItem
      key="0"
      aria-label="TripSit's Factsheets"
      title="TripSit's Factsheets"
      classNames={{
        base: "factsheetsAccBase",
        heading: "factsheetsAccHeading",
        trigger: "factsheetsAccTrigger",
        titleWrapper: "factsheetsAccWrapper",
        title: "factsheetsAccTitle",
        subtitle: "factsheetsAccSubtitle",
        startContent: "factsheetsAccContent",
        indicator: "factsheetsAccIndicator",
        content: "factsheetsAccContent",
      }}
      indicator={({ isOpen }) =>
        isOpen ? <UnfoldLessDoubleIcon /> : <UnfoldMoreDoubleIcon />
      }
    >
      <Grid item key="factsheetInfo">
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={11} md={10}>
                <Typography>
                  TripSit&apos;s factsheets are meticulously crafted to deliver
                  clear, concise, and reliable information about various
                  substances. Primarily designed for educational purposes, these
                  factsheets should not be interpreted as medical advice.
                  <br></br>
                  <br></br>
                  <b>
                    Your safety is paramount. We encourage you verify
                    information from multiple sources before making decisions
                    about substance use.
                  </b>
                  <br></br>
                  <br></br>
                  The content presented here is sourced from our comprehensive{" "}
                  <a href="https://github.com/tripsit/drugs">drug database</a>.
                  If you notice something that needs updating or have additional
                  information, please{" "}
                  <a href="https://github.com/TripSit/drugs/issues/new?assignees=LunaUrsa&labels=&projects=&template=drug-change.md&title=Update+<drug>+to+<details>">
                    submit an issue
                  </a>{" "}
                  along with your sources. We&apos;re committed to keeping our
                  data accurate and up-to-date.
                  <br></br>
                  <br></br>
                  Are you a web developer with ideas to enhance this page? Great
                  news – it&apos;s open source! Dive into our{" "}
                  <a href="https://github.com/tripsit/website">
                    GitHub repo
                  </a>{" "}
                  and contribute to the evolution of this resource. Your
                  expertise can make a significant impact!
                </Typography>
              </Grid>

              <Grid item xs={12} sm={1} md={2}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs={12}>
                    <KofiButton
                      color="#0a9396"
                      title="TripSit Ko-Fi"
                      kofiID="J3J5NOJCE"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PatreonButton />
                  </Grid>
                  <Grid item xs={12}>
                    <GithubButton />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </AccordionItem>
  </Accordion>
);

// This takes a text field, looks for words defined in the ./dictionary.json file
// and adds a tooltip to them with the definition.
const addDictionaryDefs = (text: string | undefined) => {
  if (text === undefined) {
    return "";
  }
  const words = text.split(" ");
  return words.map((word, index) => {
    // Remove the comma, we need to keep hyphens though:
    const cleanWord = word.replace(/,/g, "").toLowerCase();

    if (dictionary[cleanWord as keyof typeof dictionary]) {
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        <Tooltip arrow key={index} title={definition}>
          <span>
            <Typography
              component="span"
              style={{
                display: "inline",
                color: "darkblue",
                textDecoration: "underline",
                fontSize: "inherit", // Inherit font size
                fontFamily: "inherit", // Inherit font family
              }}
            >
              {word}
            </Typography>
            <Typography
              component="span"
              style={{
                display: "inline",
                fontSize: "inherit", // Inherit font size
                fontFamily: "inherit", // Inherit font family
              }}
            >
              {" "}
            </Typography>
          </span>
        </Tooltip>
      );
    }
    return `${word} `;
  });
};

// Function to add styling to categories within a given text.
// It processes the text to highlight each category word with specific styles.
const addCategoryStyle = (text: string | undefined) => {
  // Return an empty string if the input text is undefined
  if (text === undefined) {
    return "";
  }

  // Define a mapping of category names to their respective color styles
  // Each category has a background color and a border color
  // You can optionally also specify a text color, usually for light backgrounds
  const categoryColors = {
    psychedelic: {
      "background-color": "#00A388",
      "border-color": "#00A388",
    },
    opioid: {
      "background-color": "#C0D9AF",
      "border-color": "#C0D9AF",
    },
    stimulant: {
      "background-color": "#31B0D5",
      "border-color": "#31B0D5",
    },
    dissociative: {
      "background-color": "#9b59b6",
      "border-color": "#9b59b6",
    },
    benzodiazepine: {
      "background-color": "#bd07c2",
      "border-color": "#bd07c2",
    },
    "research-chemical": {
      "background-color": "#EC971F",
      "border-color": "#EC971F",
    },
    "habit-forming": {
      "background-color": "#e67e22",
      "border-color": "#e67e22",
    },
    depressant: {
      "background-color": "#C9302C",
      "border-color": "#C9302C",
    },
    tentative: {
      "background-color": "#FFFF9D",
      "border-color": "#FFFF9D",
      color: "#001713", // Optional text color property
    },
  } as {
    [key in Category]: {
      "background-color": string;
      "border-color": string;
      color?: string; // Example of an additional text color property
    };
  };

  // Split the input text into individual words
  const words = text.split(" ");

  return words.map((word, index) => {
    // Remove the comma, we need to keep hyphens though:
    const cleanWord = word.replace(/,/g, "").toLowerCase();

    // Check if the word is included in the categoryColors, and if so, add the styles
    if (Object.keys(categoryColors).includes(cleanWord)) {
      const colorDef = categoryColors[cleanWord as keyof typeof categoryColors];
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        <Tooltip arrow key={index} title={definition}>
          <Typography
            style={{
              display: "inline",
              color: colorDef.color ?? "white",
              fontSize: "inherit", // Inherit font size
              fontFamily: "inherit", // Inherit font family
              background: colorDef["background-color"],
              border: `2px solid ${colorDef["border-color"]}`,
            }}
          >
            {word}{" "}
          </Typography>
        </Tooltip>
      );
    }

    // If the word is not included in the categoryColors, just return the word
    // This should not happen in practice, but it's here just in case
    return `${word} `;
  });
};

// This takes the dosage data and makes a nice table out of it
const addDosages = (drugData: MRT_Row<Drug>) => {
  const doseData = drugData.original.formatted_dose as Dose;
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

  // This will store the colors for each does, since each drug has different dose levels
  const doseColors = [] as string[];
  // Like above, this stores the color the gradient will go to
  const doseGradientToColors = [] as string[];
  // This will be used by apexcharts to create the chart
  const doseSeries = [] as ApexAxisChartSeries;
  // This is used to show the text on the side of the chart
  const doseText = {} as {
    [roa: string]: {
      [strength: string]: string;
    };
  };

  // Go through each ROA
  Object.keys(doseData).forEach((roa) => {
    const roaData = doseData[roa as keyof typeof doseData] as Dosage;

    // This is the order we want them to be in
    const desiredOrder = [
      "Threshold",
      "Light",
      "Common",
      "Strong",
      "Heavy",
      "Dangerous",
      "Fatal",
    ];

    // Sort the keys according to that order
    const sortedKeys = Object.keys(roaData).sort(
      (a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b),
    );

    // For each strength in the ROA
    sortedKeys.forEach((strength) => {
      const strengthData = roaData[strength as keyof typeof roaData] as string;

      // Add the text to the doseText object so we can print it out later
      doseText[roa] = {
        ...doseText[roa],
        [strength]: strengthData,
      };

      // This essentially looks for "(any digit) (optional dash) (any digit) (optional unit)"
      const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
      const match = RegExp(regex).exec(strengthData);

      // This is mostly for type-safety
      if (match) {
        // The minimum number is the first number to appear
        const strengthMinNumber = parseFloat(match[1]);

        // The maximum number is either the second number, or if there is no second number, the first number * 1.5
        // Later, we have code that says "if there is no maximum, then do a fade out", the "1.5" is purely cosmetic
        // The doseText above displays the "+" so it's clear to the user, they never see the (dosage * 1.5) value
        const strengthMaxNumber = match[2]
          ? parseFloat(match[2])
          : strengthMinNumber * 1.5;

        // Get the color associated with the strength
        const strengthColor =
          doseColorData[strength as keyof typeof doseColorData];
        // If it's not already in the doseColors table, add it
        if (!doseColors.includes(strengthColor)) {
          doseColors.push(strengthColor);
        }

        // Get the gradient color associated with the strength
        // If it's not already in the doseGradientToColors table, add it
        const strengthGradientColor = match[2]
          ? doseGradientData[strength as keyof typeof doseGradientData]
          : "#ffffff";
        if (!doseGradientToColors.includes(strengthGradientColor)) {
          doseGradientToColors.push(strengthGradientColor);
        }

        // Check if the doseSeries already has a series with the same name
        // If it does, push the new data to that series
        // If it doesn't, create a new series
        const existingSeries = doseSeries.find(
          (series) => series.name === strength,
        );

        const roaUnit = match[3] ? ` (${match[3]})` : ``;
        if (existingSeries) {
          const existingSeriesData = existingSeries.data as {
            x: string;
            y: number[];
          }[];

          existingSeriesData.push({
            x: `${roa}${roaUnit}`,
            y: [strengthMinNumber, strengthMaxNumber],
          });
          return;
        }

        const dosePropertySeries = {
          name: strength,
          data: [
            {
              x: `${roa}${roaUnit}`,
              y: [strengthMinNumber, strengthMaxNumber],
            },
          ],
        };
        doseSeries.push(dosePropertySeries);
      }
    });
  });

  const option = {
    chart: {
      id: "doseChart",
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

  Object.values(doseText).forEach((roa) => {
    Object.keys(roa).forEach((strength) => {
      uniqueStrengths.add(strength);
    });
  });

  const allStrengths = Array.from(uniqueStrengths);
  const gridSpacing = Math.max(12 / (allStrengths.length + 1), 2); // Ensure a minimum size for the grid

  return (
    <Grid item xs={12} key="dosage">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Dosage Chart */}
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h5" style={{ color: "black" }}>
                Dosages
              </Typography>
              <ReactApexChart
                type="rangeBar"
                options={option}
                series={doseSeries}
                height={200}
                width={500}
              />
            </Grid>

            {/* Dosage Text */}
            <Grid item xs={12} sm={6} md={6}>
              <div style={{ height: "48px" }}></div>
              <Grid container spacing={0}>
                {/* Strength Headers */}
                <Grid item xs={gridSpacing}>
                  <Typography></Typography>
                </Grid>
                {allStrengths.map((strength) => (
                  <Grid item xs={gridSpacing} key={strength}>
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
                    <Grid item xs={gridSpacing}>
                      <Typography>
                        <b>{roa}</b>
                      </Typography>
                    </Grid>
                    {allStrengths.map((strength) => (
                      <Grid item xs={gridSpacing} key={`${roa}-${strength}`}>
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

const addDurations = (drugData: MRT_Row<Drug>) => {
  // We need to create a new object that has the duration data that we can use to create the chart
  // We need to create this object first because we need to know the complete duration information
  // before we can create the chart. The object will be structured like this:
  const durationTiming = {} as {
    [key: string]: {
      // ROA, eg "Oral"
      // all numbers are in hours, including minutes (30 mins = .5 hours)
      Onset?: {
        min: number;
        max: number;
        startTime: number;
        endTime: number;
      };
      Duration?: {
        min: number;
        max: number;
        startTime: number;
        endTime: number;
      };
      "After Effects"?: {
        min: number;
        max: number;
        startTime: number;
        endTime: number;
      };
    };
  };

  // This function is called for each of the three types of duration data:
  // onset, duration, and after effects
  function addDurationData(
    timingData: Duration,
    timingKey: "Onset" | "Duration" | "After Effects",
  ) {
    // If there is a "value" parameter, then assume the ROA is "Oral" and that it is the only ROA
    // Otherwise, get a list of ROAs, and either way loop through that "list"
    const roaList = timingData.value ? ["Oral"] : Object.keys(timingData);
    roaList.forEach((roa) => {
      // Get the string for the ROA. If it's a 'value' parameter, then use that, otherwise use the key
      const roaString: string = timingData.value
        ? (timingData.value as string)
        : (timingData[roa as keyof typeof timingData] as string);

      // Ignore the "_unit" property
      if (roa !== "_unit") {
        // Use regex to pull out the first value separated by a dash
        // This is the minimum value
        // If there is no dash, then the minimum and maximum values are the same
        const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
        const match = RegExp(regex).exec(roaString);

        // This is mostly for type-safety
        if (match) {
          // Max number is either the second number, or the /only/ number
          let durationMaxNumber = match[2]
            ? parseFloat(match[2])
            : parseFloat(match[1]);

          let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

          // Convert the unit to hours
          if (timingData._unit === "minutes") {
            durationMinNumber /= 60;
            durationMaxNumber /= 60;
          }

          let startTime = 0;
          let endTime = parseFloat(durationMaxNumber.toFixed(2));

          // If this is the Duration property, then we know this comes after Onset, so we need to
          // adjust the start and end times accordingly
          if (timingKey === "Duration") {
            const onsetData = durationTiming[roa]?.Onset;
            startTime = onsetData
              ? onsetData.startTime + onsetData.min
              : parseFloat(durationMinNumber.toFixed(2));
            endTime = onsetData
              ? onsetData.startTime +
                onsetData.max +
                parseFloat(durationMaxNumber.toFixed(2))
              : parseFloat(durationMaxNumber.toFixed(2));
          }

          // Same thing for After Effects
          if (timingKey === "After Effects") {
            const durationData = durationTiming[roa]?.Duration;
            startTime = durationData
              ? durationData.startTime + durationData.min
              : parseFloat(durationMinNumber.toFixed(2));
            endTime = durationData
              ? durationData.startTime +
                durationData.max +
                parseFloat(durationMaxNumber.toFixed(2))
              : parseFloat(durationMaxNumber.toFixed(2));
          }

          // Add it all to the object
          durationTiming[roa] = {
            ...durationTiming[roa],
            [timingKey]: {
              min: parseFloat(durationMinNumber.toFixed(2)),
              max: parseFloat(durationMaxNumber.toFixed(2)),
              startTime,
              endTime,
            },
          };
        }
      }
    });
  }

  // In order, we go through the three properties and add them to the durationTiming object
  if (drugData.original.formatted_onset) {
    addDurationData(drugData.original.formatted_onset, "Onset");
  }

  if (drugData.original.formatted_duration) {
    addDurationData(drugData.original.formatted_duration, "Duration");
  }

  if (drugData.original.formatted_aftereffects) {
    addDurationData(drugData.original.formatted_aftereffects, "After Effects");
  }

  // Now we need to create the array that will be used by apexcharts
  const durationSeries = [] as ApexAxisChartSeries;
  Object.keys(durationTiming).forEach((roa) => {
    const roaData = durationTiming[roa as keyof typeof durationTiming];
    if (roaData) {
      Object.keys(roaData).forEach((timing) => {
        const timingData = roaData[timing as keyof typeof roaData];
        if (timingData) {
          const data = {
            name: timing,
            data: [
              {
                x: roa,
                y: [timingData.startTime, timingData.endTime],
                goals: [
                  // The black line that signifies the minimum duration
                  {
                    name: "Minimum",
                    value: timingData.min + timingData.startTime,
                    strokeWidth: 2,
                    strokeColor: "#000000",
                  },
                ] as {}[],
              },
            ],
          };
          durationSeries.push(data);
        }
      });
    }
  });

  // Create chart options
  const option = {
    chart: {
      id: "durationChart",
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
        const s = w.config.series[seriesIndex].data[dataPointIndex];
        const roaTimingData =
          durationTiming[s.x as keyof typeof durationTiming];

        const periodData =
          roaTimingData[
            w.config.series[seriesIndex].name as keyof typeof roaTimingData
          ];

        const yStartValue = periodData ? periodData.min : 0;
        const yEndValue = periodData ? periodData.max : 0;

        let yStart = `${yStartValue}` as string;
        let yEnd = `${yEndValue}h` as string;

        // Check if the value is a decimal, if so, convert it to minutes
        if (yStartValue % 1) {
          const decimal = yStartValue % 1;
          const minutes = Math.round(decimal * 60);
          // If the hours is 0, don't display it
          yStart = `${minutes}`;
          // if the hours is above 0, display it
          if (Math.floor(yStartValue) > 0) {
            yStart = `${Math.floor(yStartValue)}h ${minutes}m`;
          }
        }

        if (yEndValue % 1) {
          const decimal = yEndValue % 1;
          const minutes = Math.round(decimal * 60);
          // If the hours is 0, don't display it
          yEnd = `${minutes}m`;
          // if the hours is above 0, display it
          if (Math.floor(yEndValue) > 0) {
            yEnd = `${Math.floor(s.y[1])}h ${minutes}m`;
          }
        }

        const action = w.config.series[seriesIndex - 1]
          ? `${w.config.series[seriesIndex - 1].name} ends`
          : "dosing";

        return `<div class="apexcharts-tooltip-rangebar"><div>
          <span class="Type">${s.x} ${w.config.series[seriesIndex].name}</span><br>
          <span class="value start-value">Lasts ${yStart}</span>
          <span class="separator">-</span>
          <span class="value end-value">${yEnd} after ${action}.</span></div></div>`;
      },
    },
  };

  // Get lists of all Roas and all duration types (onset, duration, after effects)
  const allRoas = Object.keys(durationTiming);
  const allTypes = Object.keys(durationTiming[allRoas[0]]);

  // Determine how many columns we need for the grid
  const gridSpacing = Math.max(12 / (allTypes.length + 1), 2); // Ensure a minimum size for the grid

  return (
    <Grid item xs={12} key="durations">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Duration Chart */}
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h5" style={{ color: "black" }}>
                Durations
              </Typography>
              <ReactApexChart
                type="rangeBar" // This allows us to have floating bars
                options={option}
                series={durationSeries}
                height={200}
                width={500}
              />
            </Grid>

            {/* Duration Text */}
            <Grid item xs={12} sm={6} md={6}>
              <div style={{ height: "48px" }}></div>
              <Grid container spacing={0}>
                {/* Strength Headers */}
                <Grid item xs={gridSpacing}>
                  <Typography></Typography>
                </Grid>
                {allTypes.map((type) => (
                  <Grid item xs={gridSpacing} key={type}>
                    <Typography>{type}</Typography>
                  </Grid>
                ))}

                {/* Duration Rows */}
                {Object.keys(durationTiming).map((roa) => (
                  <React.Fragment key={roa}>
                    <Grid item xs={gridSpacing}>
                      <Typography>
                        <b>{roa}</b>
                      </Typography>
                    </Grid>
                    {allTypes.map((type) => {
                      const durationRoa =
                        durationTiming[roa as keyof typeof durationTiming];
                      const durationType =
                        durationRoa[type as keyof typeof durationRoa];

                      if (!durationType) return null;

                      let durationMinText = durationType.min.toFixed(0);
                      if (durationType.min % 1) {
                        const decimal = durationType.min % 1;
                        const minutes = Math.round(decimal * 60);
                        // If the hours is 0, don't display it
                        durationMinText = `${minutes}m`;
                        // if the hours is above 0, display it
                        if (Math.floor(durationType.min) > 0) {
                          durationMinText = `${Math.floor(
                            durationType.min,
                          )}h ${minutes}m`;
                        }
                      }
                      let durationMaxText = durationType.max.toFixed(0);
                      if (durationType.max % 1) {
                        const decimal = durationType.max % 1;
                        const minutes = Math.round(decimal * 60);
                        // If the hours is 0, don't display it
                        durationMaxText = `${minutes}m`;
                        // if the hours is above 0, display it
                        if (Math.floor(durationType.max) > 0) {
                          durationMaxText = `${Math.floor(
                            durationType.max,
                          )}h ${minutes}m`;
                        }
                      }

                      return (
                        <Grid item xs={gridSpacing} key={`${roa}-${type}`}>
                          <Typography>
                            {durationMinText} to {durationMaxText}
                          </Typography>
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

function createRow(drugData: MRT_Row<Drug>): ReactNode {
  // This function goes through all the optional data in the drug and creates a nice and fancy expandable row

  // This is the array that will hold all the elements that will be displayed in the expanded row
  const elements = [] as React.JSX.Element[];

  // If there's a warning, display it first
  if (drugData.original.properties) {
    Object.keys(drugData.original.properties).forEach((property) => {
      const importantProperties = [
        "avoid",
        "warning",
        "risks",
        "adverseEffects",
        "contraindications",
      ];
      if (importantProperties.includes(property)) {
        const propertyName = property.replace(/_/g, " ");
        const propertyValue =
          drugData.original.properties[
            property as keyof typeof drugData.original.properties
          ];
        elements.push(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            key={`${drugData.original.name}-${propertyName}`}
          >
            <Card>
              <CardContent sx={{ backgroundColor: "pink" }}>
                <Typography variant="h5" style={{ color: "black" }}>
                  {propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}{" "}
                  {propertyValue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>,
        );
      }
    });
  }

  // Always push the drug name since it's the one required field
  elements.push(
    <Grid item xs={12} sm={4} md={4} key="pretty_name">
      <Card>
        <CardContent>
          <Typography variant="h5" style={{ color: "black" }}>
            Chemical Name
          </Typography>
          <Typography>{drugData.original.pretty_name}</Typography>
        </CardContent>
      </Card>
    </Grid>,
  );

  if (drugData.original.aliases) {
    elements.push(
      <Grid item xs={12} sm={4} md={4} key="aliases">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Aliases
            </Typography>
            <Typography>{drugData.original.aliases.join(", ")}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.categories) {
    // Take the category list, capitalize each word, and join them with commas

    const capitalizedCategories = drugData.original.categories
      .map(
        (category) =>
          category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      )
      .join(", ");
    try {
      elements.push(
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          key={`${drugData.original.name} categories`}
        >
          <Card>
            <CardContent>
              <Typography variant="h5" style={{ color: "black" }}>
                Categories
              </Typography>
              <Typography>
                {addDictionaryDefs(capitalizedCategories)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>,
      );
    } catch (err) {
      console.log(`Drug: ${drugData.original.name}`);
      console.log(`Categories: ${drugData.original.categories}`);
      console.log(`Error: ${err}`);
    }
  }

  if (drugData.original.properties.summary) {
    // Take the category list, capitalize each word, and join them with commas

    elements.push(
      <Grid item xs={12} sm={12} md={12} key="summary">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Summary
            </Typography>
            <Typography>
              {addDictionaryDefs(drugData.original.properties.summary)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.properties) {
    Object.keys(drugData.original.properties).forEach((property) => {
      const duplicatedProperties = [
        "avoid",
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
        "warning",
      ];
      if (duplicatedProperties.includes(property)) {
        return;
      }
      const propertyName = property.replace(/_/g, " ");
      const propertyValue =
        drugData.original.properties[
          property as keyof typeof drugData.original.properties
        ];
      elements.push(
        <Grid item xs={12} sm={6} md={4} key={propertyName}>
          <Card>
            <CardContent>
              <Typography variant="h5" style={{ color: "black" }}>
                {propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
              </Typography>
              <Typography>{propertyValue}</Typography>
            </CardContent>
          </Card>
        </Grid>,
      );
    });
  }

  // Dose note comes before dosage
  if (drugData.original.dose_note) {
    elements.push(
      <Grid item xs={12} sm={12} md={12} key="dose_note">
        <Card>
          <CardContent sx={{ backgroundColor: "yellow" }}>
            <Typography variant="h5" style={{ color: "black" }}>
              Dosage Note
            </Typography>
            <Typography>{drugData.original.dose_note}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.formatted_dose) {
    elements.push(addDosages(drugData));
  }

  if (
    drugData.original.formatted_onset ||
    drugData.original.formatted_duration ||
    drugData.original.formatted_aftereffects
  ) {
    elements.push(addDurations(drugData));
  }

  if (drugData.original.combos) {
    // const comboColors = {
    //   caution: {
    //     "background-color": "#fffacb",
    //     "border-color": "#827700",
    //   },
    //   lowDecrease: {
    //     "background-color": "#d8effe",
    //     "border-color": "#00426c",
    //   },
    //   dangerous: {
    //     "background-color": "#fdc9cc",
    //     "border-color": "#7f0006",
    //   },
    //   unsafe: {
    //     "background-color": "#ffe6cb",
    //     "border-color": "#873100",
    //   },
    //   lowIncrease: {
    //     "background-color": "#cbf0d1",
    //     "border-color": "#077c1b",
    //   },
    //   ss: {
    //     "background-color": "#dfd3ec",
    //     "border-color": "#3d166c",
    //   },
    // };

    elements.push(
      <Grid item xs={12} sm={12} md={12} key="combos">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Combos
            </Typography>
            <Typography>
              {JSON.stringify(drugData.original.combos, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.pweffects !== undefined) {
    elements.push(
      <Grid item xs={12} sm={12} md={12} key="pweffects">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Psychonaut Wiki Effects
            </Typography>
            <Grid container spacing={1}>
              {Object.keys(drugData.original.pweffects).map((property) => (
                <Grid item xs={3} key={property}>
                  <Typography>
                    <a
                      href={`https://psychonautwiki.org/wiki/${property}`}
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

  if (drugData.original.formatted_effects) {
    elements.push(
      <Grid item xs={12} sm={6} md={6} key="effects">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Effects
            </Typography>
            <Typography>
              {drugData.original.formatted_effects.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.links) {
    const linkData = drugData.original.links;
    const linkKeys = Object.keys(drugData.original.links);

    elements.push(
      <Grid item xs={12} sm={6} md={6} key="links">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
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

  if (drugData.original.sources) {
    elements.push(
      <Grid item xs={12} sm={6} md={6} key="sources">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Sources
            </Typography>
            <Typography>
              {JSON.stringify(drugData.original.sources, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {elements}
      </Grid>
    </Container>
  );
}

const Factsheets = () => {
  const {
    data: { data = [], meta } = {}, // your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<{
    data: Array<Drug>;
    meta: {
      totalRowCount: number;
    };
  }>({
    queryKey: ["table-data"],
    queryFn: async () => {
      let drugList = [] as Drug[];
      const response = await fetch(
        // TripSit's drug database file
        // This is fetched every time the user loads the page to ensure they have the latest data
        "https://raw.githubusercontent.com/TripSit/drugs/main/drugs.json",
      );
      drugList = Object.values(
        (await response.json()) as { [key: string]: Drug },
      );
      return {
        data: drugList,
        meta: {
          totalRowCount: drugList.length,
        },
      };
    },
    placeholderData: keepPreviousData,
  });

  // Define the columns
  const columns = useMemo<MRT_ColumnDef<Drug>[]>(
    // column definitions...
    () => [
      {
        accessorKey: "pretty_name",
        header: "Name",
        filterVariant: "text",
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
      },
      {
        accessorFn: (row) => {
          if (row.aliases === undefined) {
            return "";
          }
          return row.aliases.join(", ");
        },
        id: "aliases",
        header: "Aliases",
        filterVariant: "text",
        size: 200,
      },
      {
        accessorFn: (row) => row.properties.categories?.join(", "),
        id: "categories",
        header: "Categories",
        filterVariant: "text",
        enableGlobalFilter: false,
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
        Cell: ({ cell }) => (
          <span>{addCategoryStyle(cell.getValue<string | undefined>())}</span>
        ),
      },
      {
        accessorFn: (row) => {
          if (row.properties["test-kits"] === undefined) {
            return "";
          }
          return row.properties["test-kits"];
        },
        id: "reagent_results",
        header: "Reagents Results",
        filterVariant: "text",
        size: 200,
      },
      {
        accessorFn: (row) => row.formatted_effects?.join(", "),
        id: "effects",
        header: "Effects",
        filterVariant: "text",
        enableGlobalFilter: false,
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
        Cell: ({ cell }) => (
          <span>{addDictionaryDefs(cell.getValue<string | undefined>())}</span>
        ),
      },
      {
        accessorFn: (row) =>
          row.pweffects ? Object.keys(row.pweffects).join(", ") : undefined,
        id: "pweffects",
        header: "PW Effects",
        filterVariant: "text",
        enableGlobalFilter: false,
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
        Cell: ({ cell }) => (
          <span>{addDictionaryDefs(cell.getValue<string | undefined>())}</span>
        ),
      },
      {
        accessorFn: (row) => row.properties.summary,
        id: "summary",
        header: "Summary",
        filterVariant: "text",
        enableGlobalFilter: true,
        size: 900, // Make this one bigger because of the long text
        Cell: ({ cell }) => (
          <span>{addDictionaryDefs(cell.getValue<string | undefined>())}</span>
        ),
      },
    ],
    [],
    // end
  );

  const table = useMaterialReactTable({
    columns,
    data,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
    initialState: {
      showColumnFilters: true,
      columnVisibility: {
        pweffects: false,
        effects: false,
        reagent_results: false,
      },
      // rowPinning: {
      //   top: ["2-AI"],
      // },
      // expanded: {
      //   0: process.env.NODE_ENV === "development",
      // },
    },
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowPinning: true,
    enableDensityToggle: false, // Need to fix density stuff
    enableTopToolbar: true,
    enableTableHead: true,
    enableHiding: true,
    muiTablePaperProps: { sx: { height: "100vh" } }, // Takes up 100% of the viewport available
    muiTableContainerProps: { sx: { height: "78vh" } }, // This value seems to work the best
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {InfoBar}
      </>
    ),
    renderDetailPanel: ({ row }) => createRow(row),
  });

  return <MaterialReactTable table={table} data-bs-theme="dark" />;
};

const ExamplePage = () => (
  // App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <QueryClientProvider client={new QueryClient()}>
      <Factsheets />
    </QueryClientProvider>
  </LocalizationProvider>
);

export default ExamplePage;
