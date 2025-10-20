/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-duplicate-string */
import React, { ReactNode } from "react";
import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { Dosage, Dose, Drug, Duration, Status } from "tripsit_drug_db";
import dynamic from "next/dynamic";
import comboDefinitions from "../assets/comboDefinitions.json";
import addDictionaryDefs from "./addDictionaryDefs";

// We need to dynamically load this module
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type DurationTiming = {
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
  timingObject: DurationTiming,
): DurationTiming {
  // If there is a "value" parameter, then assume the ROA is "Oral" and that it is the only ROA
  // Otherwise, get a list of ROAs, and either way loop through that "list"
  const roaList = timingData.value ? ["Oral"] : Object.keys(timingData);

  const durationTiming = timingObject;

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

  return durationTiming;
}

const addDurations = (drugData: Drug) => {
  // We need to create a new object that has the duration data that we can use to create the chart
  // We need to create this object first because we need to know the complete duration information
  // before we can create the chart. The object will be structured like this:
  let durationTiming = {} as DurationTiming;

  // In order, we go through the three properties and add them to the durationTiming object
  if (drugData.formatted_onset) {
    durationTiming = addDurationData(
      drugData.formatted_onset,
      "Onset",
      durationTiming,
    );
  }

  if (drugData.formatted_duration) {
    durationTiming = addDurationData(
      drugData.formatted_duration,
      "Duration",
      durationTiming,
    );
  }

  if (drugData.formatted_aftereffects) {
    durationTiming = addDurationData(
      drugData.formatted_aftereffects,
      "After Effects",
      durationTiming,
    );
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
          } as ApexAxisChartSeries[number];
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

export default function DrugInfoCard({ drugData }: { drugData: Drug }): ReactNode {
  // This function goes through all the optional data in the drug and creates a nice and fancy expandable row

  // This is the array that will hold all the elements that will be displayed in the expanded row
  const elements = [] as React.JSX.Element[];

  // If there's a warning, display it first
  if (drugData.properties) {
    Object.keys(drugData.properties).forEach((property) => {
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
          drugData.properties[
            property as keyof typeof drugData.properties
          ];
        elements.push(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            key={`${drugData.name}-${propertyName}`}
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
          <Typography>{drugData.pretty_name}</Typography>
        </CardContent>
      </Card>
    </Grid>,
  );

  if (drugData.aliases) {
    elements.push(
      <Grid item xs={12} sm={4} md={4} key="aliases">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
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
      <Grid
        item
        xs={12}
        sm={4}
        md={4}
        key={`${drugData.name} categories`}
      >
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Categories
            </Typography>
            <Typography>{addDictionaryDefs(capitalizedCategories)}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.properties.summary) {
    // Take the category list, capitalize each word, and join them with commas

    elements.push(
      <Grid item xs={12} sm={12} md={12} key="summary">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Summary
            </Typography>
            <Typography>
              {addDictionaryDefs(drugData.properties.summary)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.properties) {
    Object.keys(drugData.properties).forEach((property) => {
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
        drugData.properties[
          property as keyof typeof drugData.properties
        ];
      if (propertyName === "experiences") {
        elements.push(
          <Grid item xs={12} sm={6} md={4} key={propertyName}>
            <Card>
              <CardContent>
                <Typography variant="h5" style={{ color: "black" }}>
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
      }
    });
  }

  // Dose note comes before dosage
  if (drugData.dose_note) {
    elements.push(
      <Grid item xs={12} sm={12} md={12} key="dose_note">
        <Card>
          <CardContent sx={{ backgroundColor: "yellow" }}>
            <Typography variant="h5" style={{ color: "black" }}>
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
    const comboData = drugData.combos;
    const comboColors = {
      Dangerous: {
        "background-color": "#fdc9cc",
        "border-color": "#7f0006",
      },
      Unsafe: {
        "background-color": "#ffe6cb",
        "border-color": "#873100",
      },
      Caution: {
        "background-color": "#fffacb",
        "border-color": "#827700",
      },
      "Low Risk & Synergy": {
        "background-color": "#cbf0d1",
        "border-color": "#077c1b",
      },
      "Low Risk & No Synergy": {
        "background-color": "#dfd3ec",
        "border-color": "#3d166c",
      },
      "Low Risk & Decrease": {
        "background-color": "#d8effe",
        "border-color": "#00426c",
      },
    };

    const comboObject = {
      Dangerous: [],
      Unsafe: [],
      Caution: [],
      "Low Risk & Synergy": [],
      "Low Risk & No Synergy": [],
      "Low Risk & Decrease": [],
    } as {
      [key in Status]: {
        name: string;
        note: string;
      }[];
    };

    const drugBList = Object.keys(comboData);
    drugBList.forEach((drugB) => {
      const { status, note } = comboData[drugB];

      const drugBNote = note ? ` (${note})` : "";

      comboObject[status as Status].push({
        name: drugB,
        note: drugBNote,
      });
    });

    elements.push(
      <Grid item xs={12} sm={12} md={12} key="combos">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
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
              <a
                href="https://combo.tripsit.me/"
                target="_blank"
                rel="noopener noreferrer"
              >
                combo.tripsit.me
              </a>
              .
            </Typography>
            {Object.keys(comboObject).map((status) => {
              const colorDef = comboColors[status as keyof typeof comboColors];
              const statusDef = comboDefinitions.find(
                (combo) => combo.status === status,
              ) as {
                status: Status;
                definition: string;
                emoji: string;
                thumbnail: string;
              };

              return (
                <React.Fragment key={status}>
                  <Card>
                    <CardContent>
                      <Grid
                        item
                        xs={12}
                        style={{
                          background: colorDef["background-color"],
                          border: `2px solid ${colorDef["border-color"]}`,
                        }}
                      >
                        <Typography>
                          <b>
                            {statusDef.emoji} {status} {statusDef.emoji}
                          </b>
                          <br></br>
                          {statusDef.definition}
                        </Typography>
                      </Grid>
                      {comboObject[status as keyof typeof comboObject].map(
                        (combo) => {
                          // This doesn't work because we use categories in the table, but we'll use this one day
                          // Find the drug in the database so we can get the pretty name
                          // const drugB = data.find((drug) => drug.name === combo.name);

                          // if (!drugB) {
                          //   throw new Error(`Drug ${combo.name} not found`);
                          // }

                          const capitalDrugs = [
                            "2c-t-x",
                            "2c-x",
                            "5-meo-xxt",
                            "amt",
                            "dmt",
                            "dox",
                            "dxm",
                            "ghb/gbl",
                            "lsd",
                            "mdma",
                            "mxe",
                            "maois",
                            "nbomes",
                            "pcp",
                            "ssris",
                          ];

                          let drugBName = combo.name
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ");

                          if (capitalDrugs.includes(combo.name)) {
                            drugBName = combo.name.toUpperCase();
                          }

                          const cleanNote = combo.note
                            .replace(/(\(|\))/g, "")
                            .replace(/ {2}/g, " ");

                          return (
                            <Grid item xs={12} key={`${combo}`}>
                              <Typography>
                                <b>{drugBName}</b>
                                {combo.note ? (
                                  <>
                                    <br />
                                    {cleanNote}
                                  </>
                                ) : (
                                  ""
                                )}
                              </Typography>
                            </Grid>
                          );
                        },
                      )}
                    </CardContent>
                  </Card>
                </React.Fragment>
              );
            })}
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.pweffects !== undefined) {
    elements.push(
      <Grid item xs={12} sm={12} md={12} key="pweffects">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Psychonaut Wiki Effects
            </Typography>
            <Grid container spacing={1}>
              {Object.keys(drugData.pweffects).map((property) => (
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

  if (drugData.formatted_effects) {
    elements.push(
      <Grid item xs={12} sm={6} md={6} key="effects">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Effects
            </Typography>
            <Typography>
              {drugData.formatted_effects.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.links) {
    const linkData = drugData.links;
    const linkKeys = Object.keys(drugData.links);

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

  if (drugData.sources) {
    const sourceData = drugData.sources;
    const links = Object.values(sourceData);
    elements.push(
      <Grid item xs={12} sm={6} md={6} key="sources">
        <Card>
          <CardContent>
            <Typography variant="h5" style={{ color: "black" }}>
              Sources
            </Typography>
            <Typography>{links}</Typography>
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
