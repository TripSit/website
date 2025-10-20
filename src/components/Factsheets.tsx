/* eslint-disable no-underscore-dangle */ // We use this because we have the _unit property
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
*/

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  IconButton,
  Tooltip,
  Typography,
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
import { Category, Drug } from "tripsit_drug_db";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Grid from "@mui/material/Grid";
import KofiButton from "kofi-button";
import UnfoldMoreDoubleIcon from "@mui/icons-material/UnfoldMoreDouble";
import UnfoldLessDoubleIcon from "@mui/icons-material/UnfoldLessDouble";
import PatreonButton from "./Patreon";
import addDictionaryDefs from "./addDictionaryDefs";

import dictionary from "../assets/dictionary.json";
import GithubButton from "./Github";
import DrugInfoCard from "./DrugInfo";

// If you want to debug a specific drug, change the below variable to the name of the drug
// and then use the commented-out code below that to display what you need to debug
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const debugDrug = "cocaine";
// if (drugData.original.name === debugDrug) {
//   console.log(`roaString: ${JSON.stringify(roaString, null, 2)}`);
// }

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
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowPinning: true,
    // enableRowSelection: true,
    rowPinningDisplayMode: "top",
    enableDensityToggle: true, // Need to fix density stuff
    enableTopToolbar: true,
    enableTableHead: true,
    enableHiding: true,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
    getRowId: (row) => row.name,
    initialState: {
      showColumnFilters: true,
      columnVisibility: {
        pweffects: false,
        effects: false,
        reagent_results: false,
      },
      // rowPinning: {
      //   top: ["0"],
      // },
      // rowSelection: {
      //   cocaine: true,
      // },
      // expanded: {
      //   0: process.env.NODE_ENV === "development",
      // },
    },
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
    renderDetailPanel: ({ row }) => DrugInfoCard({ drugData: row.original }),
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
