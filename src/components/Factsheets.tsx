// We use this because we have the _unit property
// Make things easier to read

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

import React, { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton as ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton as ToggleDensePaddingButton,
  MRT_ToggleFiltersButton as ToggleFiltersButton,
  MRT_ToggleFullScreenButton as ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton as ToggleGlobalFilterButton,
  useMaterialReactTable,
  type MRT_Cell,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Accordion } from "@heroui/react";
import AccordionSection from "./AccordionSection";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Category, Drug } from "tripsit_drug_db";
import { useDrugs } from "../utils/drugs";
import Grid from "@mui/material/Grid";
import KofiButton from "kofi-button";
import UnfoldMoreDoubleIcon from "@mui/icons-material/UnfoldMoreDouble";
import UnfoldLessDoubleIcon from "@mui/icons-material/UnfoldLessDouble";
import PatreonButton from "./Patreon";
import addDictionaryDefs from "./addDictionaryDefs";
import { splitWords } from "../utils/splitWords";

import dictionary from "../assets/dictionary.json";
import pinnedDrugs from "../assets/pinnedDrugs.json";
import GithubButton from "./Github";
import DrugInfoCard from "./DrugInfo";
import ReagentResults from "./ReagentResults";

// This appears at the top and can contain any information you want
// We can use this for announcements or updates
const InfoBar = (
  // We use the accordion item to make it collapsible
  <Accordion className="w-full px-2">
    <AccordionSection
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
      <Grid key="factsheetInfo">
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 11, md: 10 }}>
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

              <Grid size={{ xs: 12, sm: 1, md: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <KofiButton
                      color="#0a9396"
                      title="TripSit Ko-Fi"
                      kofiID="J3J5NOJCE"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <PatreonButton />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <GithubButton />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </AccordionSection>
  </Accordion>
);

// Function to add styling to categories within a given text.
// It processes the text to highlight each category word with specific styles.
const addCategoryStyle = (text: string | undefined): React.JSX.Element[] => {
  // Nothing to render if the input text is undefined
  if (text === undefined) {
    return [];
  }

  // Define a mapping of category names to their respective color styles
  // Each category has a background color and a border color
  // Chips whose background fails 4.5:1 contrast with white text use dark text instead.
  const categoryColors = {
    psychedelic: {
      "background-color": "#00A388",
      "border-color": "#00A388",
      color: "#001713",
    },
    opioid: {
      "background-color": "#C0D9AF",
      "border-color": "#C0D9AF",
      color: "#001713",
    },
    stimulant: {
      "background-color": "#31B0D5",
      "border-color": "#31B0D5",
      color: "#001713",
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
      color: "#001713",
    },
    "habit-forming": {
      "background-color": "#e67e22",
      "border-color": "#e67e22",
      color: "#001713",
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
  return splitWords(text).map(({ word, key }) => {
    // Remove the comma, we need to keep hyphens though:
    const cleanWord = word.replaceAll(",", "").toLowerCase();

    // Check if the word is included in the categoryColors, and if so, add the styles
    if (Object.keys(categoryColors).includes(cleanWord)) {
      const colorDef = categoryColors[cleanWord as keyof typeof categoryColors];
      const definition = dictionary[cleanWord as keyof typeof dictionary];
      return (
        // describeChild: the definition describes the word (aria-describedby) instead of
        // replacing its name with an aria-label, which isn't allowed on a plain span or p.
        <Tooltip arrow describeChild key={key} title={definition}>
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
    return <Fragment key={key}>{`${word} `}</Fragment>;
  });
};

// Table cell renderers. Defined once here rather than inline in the column definitions, so
// React sees the same component type on every render instead of remounting the cells.
type DrugCellProps = Readonly<{ cell: MRT_Cell<Drug> }>;

// Each drug's own page, so a factsheet can be linked to and shared.
const NameCell = ({ cell }: DrugCellProps) => (
  <Link href={`/factsheets/${encodeURIComponent(cell.row.original.name)}`}>
    {cell.getValue<string>()}
  </Link>
);

const CategoryCell = ({ cell }: DrugCellProps) => (
  <span>{addCategoryStyle(cell.getValue<string | undefined>())}</span>
);

const DictionaryCell = ({ cell }: DrugCellProps) => (
  <span>{addDictionaryDefs(cell.getValue<string | undefined>())}</span>
);

const ReagentCell = ({ cell }: DrugCellProps) => (
  <ReagentResults text={cell.getValue<string | undefined>()} />
);

type RowPinning = { top?: string[]; bottom?: string[] };

// Only pinned drugs that are loaded reach the table: it throws on an ID it can't find, which
// is every ID until drugs.json arrives.
function loadedPins(pinning: RowPinning, loaded: ReadonlySet<string>) {
  const keep = (names: string[] = []) =>
    names.filter((name) => loaded.has(name));
  return { top: keep(pinning.top), bottom: keep(pinning.bottom) };
}

const Factsheets = () => {
  const { data = [], isError, isRefetching, isLoading, refetch } = useDrugs();
  // Drugs named in src/assets/pinnedDrugs.json (such as ones just added) start pinned to the
  // top. Visitors can pin and unpin rows too.
  const [rowPinning, setRowPinning] = useState<RowPinning>({
    top: pinnedDrugs,
    bottom: [],
  });
  const tableRowPinning = useMemo(
    () => loadedPins(rowPinning, new Set(data.map((drug) => drug.name))),
    [rowPinning, data],
  );

  // Define the columns
  const columns = useMemo<MRT_ColumnDef<Drug>[]>(
    // column definitions...
    () => [
      {
        accessorKey: "pretty_name",
        header: "Name",
        filterVariant: "text",
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
        Cell: NameCell,
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
        Cell: CategoryCell,
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
        Cell: ReagentCell,
      },
      {
        accessorFn: (row) => row.formatted_effects?.join(", "),
        id: "effects",
        header: "Effects",
        filterVariant: "text",
        enableGlobalFilter: false,
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
        Cell: DictionaryCell,
      },
      {
        accessorFn: (row) =>
          row.pweffects ? Object.keys(row.pweffects).join(", ") : undefined,
        id: "pweffects",
        header: "PW Effects",
        filterVariant: "text",
        enableGlobalFilter: false,
        size: 180, // This is the default value, but it stops the column from changing when the table is resized
        Cell: DictionaryCell,
      },
      {
        accessorFn: (row) => row.properties.summary,
        id: "summary",
        header: "Summary",
        filterVariant: "text",
        enableGlobalFilter: true,
        size: 900, // Make this one bigger because of the long text
        Cell: DictionaryCell,
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
    // One continuous list instead of pages of 10 (#83). Only the rows in view (plus a few
    // either side) are in the page at once, so scrolling all ~550 drugs stays quick.
    enablePagination: false,
    enableRowVirtualization: true,
    rowVirtualizerOptions: { overscan: 8 },
    // Pagination used to say how many drugs matched; keep that count.
    renderBottomToolbarCustomActions: ({ table }) => (
      <Typography variant="body2" sx={{ px: 1 }} aria-live="polite">
        {table.getFilteredRowModel().rows.length} of {data.length} substances
      </Typography>
    ),
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      rowPinning: tableRowPinning,
    },
    onRowPinningChange: setRowPinning,
    getRowId: (row) => row.name,
    initialState: {
      showColumnFilters: true,
      columnVisibility: {
        pweffects: false,
        effects: false,
        reagent_results: false,
      },
      // rowSelection: {
      //   cocaine: true,
      // },
      // expanded: {
      //   0: process.env.NODE_ENV === "development",
      // },
    },
    muiTablePaperProps: {
      sx: {
        height: "100vh", // Takes up 100% of the viewport available
        // The site-wide link blue (#2487ce) is 3.9:1 on this white table; this is 4.9:1.
        "& a:not([class])": { color: "#1f75b3" },
      },
    },
    muiTableContainerProps: {
      sx: {
        height: "78vh", // This value seems to work the best
        // Lets the detail panel size itself to the visible part of the table (100cqw)
        // rather than to the full width of all the columns.
        containerType: "inline-size",
      },
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => void refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {InfoBar}
      </>
    ),
    // The same buttons MRT shows by default, but allowed to wrap on phones: MRT's own row of
    // them never wraps, which pushed the density and full-screen buttons off a phone's screen.
    renderToolbarInternalActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          justifyContent: "flex-end",
        }}
      >
        <ToggleGlobalFilterButton table={table} />
        <ToggleFiltersButton table={table} />
        <ShowHideColumnsButton table={table} />
        <ToggleDensePaddingButton table={table} />
        <ToggleFullScreenButton table={table} />
      </Box>
    ),
    // MRT calls this for every row on the page on every render, expanded or not, and only
    // mounts the result once the row is expanded. Return an element rather than calling
    // DrugInfoCard directly, so the card (its charts, combos and dictionary tooltips) is only
    // built for expanded rows.
    // The detail panel spans every column, so on a narrow screen most of the card was off to
    // the right. Size it to the visible width of the table and keep it in view while the
    // columns scroll sideways.
    renderDetailPanel: ({ row }) => (
      <Box
        data-testid="factsheet-detail"
        sx={{ position: "sticky", left: "1rem", width: "calc(100cqw - 2rem)" }}
      >
        <DrugInfoCard drugData={row.original} />
      </Box>
    ),
  });

  return <MaterialReactTable table={table} data-bs-theme="dark" />;
};

export default Factsheets;
