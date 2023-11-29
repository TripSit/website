/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */

// "use client";

// Combos
// Add optional columns
// Fix when the density is changed
// Add dark mode? / theme https://mui.com/material-ui/customization/default-theme/
// Add elevated/drop shadow stuff per rooni - https://discord.com/channels/179641883222474752/1052608066085978213/1179249353936867398

// DMT durations are messed up
// DMT is missing dosages

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
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"; // note: this is TanStack Rea`ct Query V5
import { Dosage, Drug } from "drugs.json";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Grid from "@mui/material/Grid";

import dynamic from "next/dynamic";

import dictionary from "../assets/dictionary.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugDrug = "1,4-butanediol";

const queryClient = new QueryClient();

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type DrugApiResponse = {
  data: Array<Drug>;
  meta: {
    totalRowCount: number;
  };
};

interface DoseText {
  [roa: string]: {
    [strength: string]: string;
  };
}

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

// const comboColors = {
//   caution: {
//     "background-color": "#fffacb",
//     "border-color": "#827700",
//   },
//   lowdec: {
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
//   lowinc: {
//     "background-color": "#cbf0d1",
//     "border-color": "#077c1b",
//   },
//   ss: {
//     "background-color": "#dfd3ec",
//     "border-color": "#3d166c",
//   },
// };

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
  },
};

const addDictionaryDefs = (text: string) => {
  const words = text.split(" ");
  return words.map((word, index) => {
    // Remove the comman, we need to keep hyphens though:
    const cleanWord = word.replace(/,/g, "").toLowerCase();

    if (dictionary[cleanWord as keyof typeof dictionary]) {
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        <Tooltip arrow key={index} title={definition}>
          <span>
            <Typography
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

const addCategoryStyle = (text: string) => {
  const words = text.split(" ");
  return words.map((word, index) => {
    // Remove the comman, we need to keep hyphens though:
    const cleanWord = word.replace(/,/g, "").toLowerCase();

    if (Object.keys(categoryColors).includes(cleanWord)) {
      const colorDef = categoryColors[cleanWord as keyof typeof categoryColors];
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        <Tooltip arrow key={index} title={definition}>
          <span>
            <Typography
              style={{
                display: "inline",
                color: "white",
                fontSize: "inherit", // Inherit font size
                fontFamily: "inherit", // Inherit font family
                background: colorDef["background-color"],
                border: `2px solid ${colorDef["border-color"]}`,
              }}
            >
              {word}
            </Typography>
            <Typography
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

const getAllUniqueStrengths = (doseText: DoseText): string[] => {
  const allStrengths = new Set<string>();
  Object.values(doseText).forEach((roa) => {
    Object.keys(roa).forEach((strength) => {
      allStrengths.add(strength);
    });
  });
  return Array.from(allStrengths);
};

function createRow(drugData: MRT_Row<Drug>): ReactNode {
  // This function goes through all the optional data in the drug and creates a nice and fancy expandable row

  const elements = [];
  const doseColors = [] as string[];
  const doseGradientToColors = [] as string[];

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
          <Grid item xs={12} sm={12} md={12} key={propertyName}>
            <Card>
              <CardContent sx={{ backgroundColor: "pink" }}>
                <Typography variant="h5">
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

  elements.push(
    <Grid item xs={12} sm={4} md={4} key="pretty_name">
      <Card>
        <CardContent>
          <Typography variant="h5">Chemical Name</Typography>
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
            <Typography variant="h5">Aliases</Typography>
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

    elements.push(
      <Grid item xs={12} sm={4} md={4} key="categories">
        <Card>
          <CardContent>
            <Typography variant="h5">Categories</Typography>
            <Typography>{addDictionaryDefs(capitalizedCategories)}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.properties.summary) {
    // Take the category list, capitalize each word, and join them with commas

    elements.push(
      <Grid item xs={12} sm={12} md={12} key="categories">
        <Card>
          <CardContent>
            <Typography variant="h5">Summary</Typography>
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
              <Typography variant="h5">
                {propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
              </Typography>
              <Typography>{propertyValue}</Typography>
            </CardContent>
          </Card>
        </Grid>,
      );
    });
  }

  if (drugData.original.dose_note) {
    elements.push(
      <Grid item xs={12} sm={12} md={12} key="dose_note">
        <Card>
          <CardContent sx={{ backgroundColor: "yellow" }}>
            <Typography variant="h5">Dosage Note</Typography>
            <Typography>{drugData.original.dose_note}</Typography>
          </CardContent>
        </Card>
      </Grid>,
    );
  }

  if (drugData.original.formatted_dose) {
    const doseData = drugData.original.formatted_dose;
    const doseSeries = [] as ApexAxisChartSeries;
    const doseText = {} as {
      [key: string]: {
        [key: string]: string;
      };
    };
    Object.keys(doseData).forEach((roa) => {
      const roaData = doseData[roa as keyof typeof doseData] as Dosage;

      const desiredOrder = [
        "Threshold",
        "Light",
        "Common",
        "Strong",
        "Heavy",
        "Dangerous",
        "Fatal",
      ];

      const sortedKeys = Object.keys(roaData).sort(
        (a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b),
      );

      sortedKeys.forEach((strength) => {
        // Get the color associated with the strength
        // If it's not already in the doseColors table, add it

        const strengthData = roaData[
          strength as keyof typeof roaData
        ] as string;

        doseText[roa] = {
          ...doseText[roa],
          [strength]: strengthData,
        };

        const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
        const match = RegExp(regex).exec(strengthData);

        if (match === null) {
          return;
        }

        const roaUnit = match[3] ? ` (${match[3]})` : ``;

        // The the units at the end
        const strengthMinNumber = parseFloat(match[1]);

        const strengthMaxNumber = match[2]
          ? parseFloat(match[2])
          : strengthMinNumber * 1.5;

        const strengthColor =
          doseColorData[strength as keyof typeof doseColorData];
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

    const allStrengths = getAllUniqueStrengths(doseText);
    const gridSpacing = Math.max(12 / (allStrengths.length + 1), 2); // Ensure a minimum size for the grid

    elements.push(
      <Grid item xs={12} key="dosage">
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              {/* Dosage Chart */}
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Dosages</Typography>
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
                            doseColorData[
                              strength as keyof typeof doseColorData
                            ],
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
      </Grid>,
    );
  }

  if (
    drugData.original.formatted_onset ||
    drugData.original.formatted_duration ||
    drugData.original.formatted_aftereffects
  ) {
    const durationSeries = [] as ApexAxisChartSeries;
    const durationTiming = {} as {
      [key: string]: {
        // all numbers are in hours
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

    if (drugData.original.formatted_onset) {
      // const durationData = addDurationData(
      //   "Onset",
      //   drugData.original.formatted_onset,
      // );
      // durationSeries.push(...durationData);
      const onsetData = drugData.original.formatted_onset;

      // if (drugData.original.name === debugDrug) {
      //   console.log(`onsetData: ${JSON.stringify(onsetData, null, 2)}`);
      // }

      if (onsetData._unit) {
        if (onsetData.value) {
          // Use regex to pull out the first value separated by a dash
          // This is the minimum value
          // If there is no dash, then the minimum and maximum values are the same
          const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
          const match = RegExp(regex).exec(onsetData.value);

          if (match) {
            // Max number is either the second number, or the /only/ number
            let durationMaxNumber = match[2]
              ? parseFloat(match[2])
              : parseFloat(match[1]);

            // if (drugData.original.name === debugDrug) {
            //   console.log(
            //     `durationMaxNumber: ${JSON.stringify(
            //       durationMaxNumber,
            //       null,
            //       2,
            //     )}`,
            //   );
            // }

            // Min number is the first number, or if only one number exists, it starts at 0
            let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

            // if (drugData.original.name === debugDrug) {
            //   console.log(
            //     `durationMinNumber: ${JSON.stringify(
            //       durationMinNumber,
            //       null,
            //       2,
            //     )}`,
            //   );
            // }

            // Convert the unit to hours
            if (onsetData._unit === "minutes") {
              durationMinNumber /= 60;
              durationMaxNumber /= 60;
            }

            // if (drugData.original.name === debugDrug) {
            //   console.log(
            //     `durationTiming: ${JSON.stringify(durationTiming, null, 2)}`,
            //   );
            // }
            durationTiming.Oral = {
              ...durationTiming.Oral,
              Onset: {
                min: parseFloat(durationMinNumber.toFixed(2)),
                max: parseFloat(durationMaxNumber.toFixed(2)),
                startTime: 0,
                endTime: parseFloat(durationMaxNumber.toFixed(2)),
              },
            };
          }
        } else {
          // console.log(
          //   `onsetData.value is undefined on ${drugData.original.name}`,
          // );

          Object.keys(onsetData).forEach((roa) => {
            const roaData = onsetData[roa as keyof typeof onsetData] as string;

            if (roa !== "_unit") {
              // if (drugData.original.name === debugDrug) {
              //   console.log(
              //     `roaData: ${roa} =  ${JSON.stringify(roaData, null, 2)}`,
              //   );
              // }

              // Use regex to pull out the first value separated by a dash
              // This is the minimum value
              // If there is no dash, then the minimum and maximum values are the same
              const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
              const match = RegExp(regex).exec(roaData);

              if (match) {
                // Max number is either the second number, or the /only/ number
                let durationMaxNumber = match[2]
                  ? parseFloat(match[2])
                  : parseFloat(match[1]);

                let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

                // Convert the unit to hours
                if (onsetData._unit === "minutes") {
                  durationMinNumber /= 60;
                  durationMaxNumber /= 60;
                }

                // if (drugData.original.name === debugDrug) {
                //   console.log(
                //     `durationTiming: ${JSON.stringify(
                //       durationTiming,
                //       null,
                //       2,
                //     )}`,
                //   );
                // }
                durationTiming[roa] = {
                  ...durationTiming[roa],
                  Onset: {
                    min: parseFloat(durationMinNumber.toFixed(2)),
                    max: parseFloat(durationMaxNumber.toFixed(2)),
                    startTime: 0,
                    endTime: parseFloat(durationMaxNumber.toFixed(2)),
                  },
                };
              }
            }
          });
        }
      }
    }

    // if (drugData.original.name === debugDrug) {
    //   console.log(
    //     `Added onset data: ${JSON.stringify(durationTiming, null, 2)}`,
    //   );
    // }

    if (drugData.original.formatted_duration) {
      // const durationData = addDurationData(
      //   "Duration",
      //   drugData.original.formatted_duration,
      // );
      // durationSeries.push(...durationData);

      const durationData = drugData.original.formatted_duration;

      if (durationData._unit) {
        if (durationData.value) {
          // Use regex to pull out the first value separated by a dash
          // This is the minimum value
          // If there is no dash, then the minimum and maximum values are the same
          const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
          const match = RegExp(regex).exec(durationData.value);

          if (match) {
            // Max number is either the second number, or the /only/ number
            let durationMaxNumber = match[2]
              ? parseFloat(match[2])
              : parseFloat(match[1]);

            // Min number is the first number, or if only one number exists, it starts at 0
            let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

            // Convert the unit to hours
            if (durationData._unit === "minutes") {
              durationMinNumber /= 60;
              durationMaxNumber /= 60;
            }

            let durationData2 = durationTiming.Oral;

            if (!durationData2) {
              // console.log(
              //   `durationData is undefined on ${drugData.original.name}`,
              // );
              // console.log(
              //   `durationData: ${JSON.stringify(durationData, null, 2)}`,
              // );

              Object.keys(durationTiming).forEach((roa) => {
                durationData2 = durationTiming[roa];
                const startTime = durationData2.Duration
                  ? durationData2.Duration.startTime +
                    durationData2.Duration.min
                  : parseFloat(durationMinNumber.toFixed(2));

                const endTime = durationData2.Duration
                  ? durationData2.Duration.startTime +
                    durationData2.Duration.max +
                    parseFloat(durationMaxNumber.toFixed(2))
                  : parseFloat(durationMaxNumber.toFixed(2));

                durationTiming.Oral = {
                  ...durationData2,
                  "After Effects": {
                    min: parseFloat(durationMinNumber.toFixed(2)),
                    max: parseFloat(durationMaxNumber.toFixed(2)),
                    startTime,
                    endTime,
                  },
                };
              });
            } else {
              durationTiming.Oral = {
                ...durationTiming.Oral,
                Duration: {
                  min: parseFloat(durationMinNumber.toFixed(2)),
                  max: parseFloat(durationMaxNumber.toFixed(2)),
                  startTime: durationTiming.Oral.Onset
                    ? durationTiming.Oral.Onset.min
                    : parseFloat(durationMinNumber.toFixed(2)),
                  endTime: durationTiming.Oral.Onset
                    ? durationTiming.Oral.Onset.max +
                      parseFloat(durationMaxNumber.toFixed(2))
                    : parseFloat(durationMaxNumber.toFixed(2)),
                },
              };
            }
          }
        } else {
          // console.log(
          //   `durationData.value is undefined on ${drugData.original.name}`,
          // );

          Object.keys(durationData).forEach((roa) => {
            const roaData = durationData[
              roa as keyof typeof durationData
            ] as string;

            if (roa !== "_unit") {
              // if (drugData.original.name === debugDrug) {
              //   console.log(
              //     `roaData: ${roa} =  ${JSON.stringify(roaData, null, 2)}`,
              //   );
              // }

              // Use regex to pull out the first value separated by a dash
              // This is the minimum value
              // If there is no dash, then the minimum and maximum values are the same
              const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
              const match = RegExp(regex).exec(roaData);

              if (match) {
                // Max number is either the second number, or the /only/ number
                let durationMaxNumber = match[2]
                  ? parseFloat(match[2])
                  : parseFloat(match[1]);

                let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

                // Convert the unit to hours
                if (durationData._unit === "minutes") {
                  durationMinNumber /= 60;
                  durationMaxNumber /= 60;
                }

                // if (drugData.original.name === debugDrug) {
                //   console.log(
                //     `durationTiming: ${JSON.stringify(
                //       durationTiming,
                //       null,
                //       2,
                //     )}`,
                //   );
                // }
                durationTiming[roa] = {
                  ...durationTiming[roa],
                  Duration: {
                    min: parseFloat(durationMinNumber.toFixed(2)),
                    max: parseFloat(durationMaxNumber.toFixed(2)),
                    startTime: 0,
                    endTime: parseFloat(durationMaxNumber.toFixed(2)),
                  },
                };
              }
            }
          });
        }
      }
    }

    // if (drugData.original.name === debugDrug) {
    //   console.log(
    //     `Added duration data: ${JSON.stringify(durationTiming, null, 2)}`,
    //   );
    // }

    if (drugData.original.formatted_aftereffects) {
      // const durationData = addDurationData(
      //   "After Effects",
      //   drugData.original.formatted_aftereffects,
      // );
      // durationSeries.push(...durationData);

      const effectData = drugData.original.formatted_aftereffects;

      if (effectData._unit) {
        if (effectData.value) {
          // Use regex to pull out the first value separated by a dash
          // This is the minimum value
          // If there is no dash, then the minimum and maximum values are the same
          const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
          const match = RegExp(regex).exec(effectData.value);

          if (match) {
            // Max number is either the second number, or the /only/ number
            let durationMaxNumber = match[2]
              ? parseFloat(match[2])
              : parseFloat(match[1]);

            // Min number is the first number, or if only one number exists, it starts at 0
            let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

            // Convert the unit to hours
            if (effectData._unit === "minutes") {
              durationMinNumber /= 60;
              durationMaxNumber /= 60;
            }

            // if (drugData.original.name === debugDrug) {
            //   console.log(
            //     `durationTiming before error: ${JSON.stringify(
            //       durationTiming,
            //       null,
            //       2,
            //     )}`,
            //   );
            // }

            let durationData = durationTiming.Oral;

            if (!durationData) {
              // console.log(
              //   `durationData is undefined on ${drugData.original.name}`,
              // );
              // console.log(
              //   `durationData: ${JSON.stringify(durationData, null, 2)}`,
              // );

              Object.keys(durationTiming).forEach((roa) => {
                durationData = durationTiming[roa];
                const startTime = durationData.Duration
                  ? durationData.Duration.startTime + durationData.Duration.min
                  : parseFloat(durationMinNumber.toFixed(2));

                const endTime = durationData.Duration
                  ? durationData.Duration.startTime +
                    durationData.Duration.max +
                    parseFloat(durationMaxNumber.toFixed(2))
                  : parseFloat(durationMaxNumber.toFixed(2));

                durationTiming[roa] = {
                  ...durationTiming[roa],
                  "After Effects": {
                    min: parseFloat(durationMinNumber.toFixed(2)),
                    max: parseFloat(durationMaxNumber.toFixed(2)),
                    startTime,
                    endTime,
                  },
                };
              });
            } else {
              const startTime = durationData.Duration
                ? durationData.Duration.startTime + durationData.Duration.min
                : parseFloat(durationMinNumber.toFixed(2));

              const endTime = durationData.Duration
                ? durationData.Duration.startTime +
                  durationData.Duration.max +
                  parseFloat(durationMaxNumber.toFixed(2))
                : parseFloat(durationMaxNumber.toFixed(2));

              durationTiming.Oral = {
                ...durationData,
                "After Effects": {
                  min: parseFloat(durationMinNumber.toFixed(2)),
                  max: parseFloat(durationMaxNumber.toFixed(2)),
                  startTime,
                  endTime,
                },
              };
            }
          }
        } else {
          // console.log(
          //   `effectData.value is undefined on ${drugData.original.name}`,
          // );

          Object.keys(effectData).forEach((roa) => {
            const roaData = effectData[
              roa as keyof typeof effectData
            ] as string;

            if (roa !== "_unit") {
              // if (drugData.original.name === debugDrug) {
              //   console.log(
              //     `roaData: ${roa} =  ${JSON.stringify(roaData, null, 2)}`,
              //   );
              // }

              // Use regex to pull out the first value separated by a dash
              // This is the minimum value
              // If there is no dash, then the minimum and maximum values are the same
              const regex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?([a-zA-Z]+)?/;
              const match = RegExp(regex).exec(roaData);

              if (match) {
                // Max number is either the second number, or the /only/ number
                let durationMaxNumber = match[2]
                  ? parseFloat(match[2])
                  : parseFloat(match[1]);

                let durationMinNumber = match[2] ? parseFloat(match[1]) : 0;

                // Convert the unit to hours
                if (effectData._unit === "minutes") {
                  durationMinNumber /= 60;
                  durationMaxNumber /= 60;
                }

                // if (drugData.original.name === debugDrug) {
                //   console.log(
                //     `durationTiming: ${JSON.stringify(
                //       durationTiming,
                //       null,
                //       2,
                //     )}`,
                //   );
                // }
                durationTiming[roa] = {
                  ...durationTiming[roa],
                  "After Effects": {
                    min: parseFloat(durationMinNumber.toFixed(2)),
                    max: parseFloat(durationMaxNumber.toFixed(2)),
                    startTime: 0,
                    endTime: parseFloat(durationMaxNumber.toFixed(2)),
                  },
                };
              }
            }
          });
        }
      }
    }

    // if (drugData.original.name === debugDrug) {
    //   console.log(
    //     `Added aftereffects data: ${JSON.stringify(durationTiming, null, 2)}`,
    //   );
    // }

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

    // if (drugData.original.name === debugDrug) {
    //   console.log(
    //     `Duration series: ${JSON.stringify(durationSeries, null, 2)}`,
    //   );
    // }

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
          w: any;
        }) => {
          const s = w.config.series[seriesIndex].data[dataPointIndex];
          const roaTimingData =
            durationTiming[s.x as keyof typeof durationTiming];

          const periodData =
            roaTimingData[
              w.config.series[seriesIndex].name as keyof typeof roaTimingData
            ];

          // if (drugData.original.name === debugDrug) {
          //   console.log(
          //     `periodData for ${
          //       w.config.series[seriesIndex].name as keyof typeof roaTimingData
          //     }: ${JSON.stringify(periodData, null, 2)}`,
          //   );
          // }

          const yStartValue = periodData ? periodData.min : 0;
          const yEndValue = periodData ? periodData.max : 0;

          let yStart = `${yStartValue}` as string;
          let yEnd = `${yEndValue}h` as string;

          // if (drugData.original.name === debugDrug) {
          //   console.log(`yStartValue: ${JSON.stringify(yStartValue, null, 2)}`);
          // }

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

          // if (drugData.original.name === debugDrug) {
          //   console.log(`yStart: ${JSON.stringify(yStart, null, 2)}`);
          // }

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

          // if (drugData.original.name === debugDrug) {
          //   console.log(`yEnd: ${JSON.stringify(yEnd, null, 2)}`);
          // }

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

    // if (drugData.original.name === debugDrug) {
    //   console.log(
    //     `Duration series: ${JSON.stringify(durationSeries, null, 2)}`,
    //   );
    //   console.log(
    //     `Duration timing: ${JSON.stringify(durationTiming, null, 2)}`,
    //   );
    // }

    const allRoas = Object.keys(durationTiming);
    // if (drugData.original.name === debugDrug) {
    //   console.log(`allRoas: ${JSON.stringify(allRoas, null, 2)}`);
    // }
    let allTypes = [] as string[];
    try {
      allTypes = Object.keys(durationTiming[allRoas[0]]);
    } catch (err) {
      console.log(`Error: ${err}`);
      console.log(
        `drugName: ${JSON.stringify(drugData.original.name, null, 2)}`,
      );
      console.log(`durationTiming: ${JSON.stringify(durationTiming, null, 2)}`);
      console.log(`allRoas: ${JSON.stringify(allRoas, null, 2)}`);
      console.log(
        `onset: ${JSON.stringify(drugData.original.formatted_onset, null, 2)}`,
      );
      console.log(
        `duration: ${JSON.stringify(
          drugData.original.formatted_duration,
          null,
          2,
        )}`,
      );
      console.log(
        `after: ${JSON.stringify(
          drugData.original.formatted_aftereffects,
          null,
          2,
        )}`,
      );
    }
    // if (drugData.original.name === debugDrug) {
    //   console.log(`allTypes: ${JSON.stringify(allTypes, null, 2)}`);
    // }
    const gridSpacing = Math.max(12 / (allTypes.length + 1), 2); // Ensure a minimum size for the grid

    elements.push(
      <Grid item xs={12} key="durations">
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              {/* Duration Chart */}
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Durations</Typography>
                <ReactApexChart
                  type="rangeBar"
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
      </Grid>,
    );
  }

  if (drugData.original.combos) {
    elements.push(
      <Grid item xs={12} sm={12} md={12} key="combos">
        <Card>
          <CardContent>
            <Typography variant="h5">Combos</Typography>
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
            <Typography variant="h5">Psychonaut Wiki Effects</Typography>
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
            <Typography variant="h5">Effects</Typography>
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
            <Typography variant="h5">Links</Typography>
            {linkKeys.map((property) => (
              // Capitalize the first letter of the property name
              // https://stackoverflow.com/a/1026087

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
            <Typography variant="h5">Sources</Typography>
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
  } = useQuery<DrugApiResponse>({
    queryKey: ["table-data"],
    queryFn: async () => {
      let drugList = [] as Drug[];
      const response = await fetch(
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
          <span>{addCategoryStyle(cell.getValue<string>())}</span>
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
          <span>{addDictionaryDefs(cell.getValue<string>())}</span>
        ),
      },
    ],
    [],
    // end
  );

  const table = useMaterialReactTable({
    columns,
    data,
    // enableRowPinning: true,
    initialState: {
      showColumnFilters: true,
      // rowPinning: {
      //   top: [],
      // },
      expanded: {
        0: process.env.NODE_ENV === "development",
      },
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    renderDetailPanel: ({ row }) => createRow(row),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
  });

  return <MaterialReactTable table={table} />;
};

const ExamplePage = () => (
  // App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <QueryClientProvider client={queryClient}>
      <Factsheets />
    </QueryClientProvider>
  </LocalizationProvider>
);

export default ExamplePage;
