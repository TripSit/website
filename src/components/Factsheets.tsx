

/* eslint-disable no-underscore-dangle */ // We use this because we have the _unit property
/* eslint-disable react/no-unstable-nested-components */
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

import React, { useMemo, useState, createContext, useContext, useEffect, useRef, useCallback, memo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";
import {
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  InputBase,
  Paper,
  Collapse,
  GlobalStyles,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import BiotechIcon from "@mui/icons-material/Biotech";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"; // note: this is TanStack React Query V5
import { Drug } from "tripsit_drug_db";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Grid from "@mui/material/Grid";
import KofiButton from "kofi-button";
import PatreonButton from "./Patreon";
import addDictionaryDefs from "./addDictionaryDefs";
import dictionary from "../assets/dictionary.json";
import GithubButton from "./Github";
import DrugInfoCard from "./DrugInfo";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getAppleTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "light" ? "#F5F5F7" : "#000000",
        paper: mode === "light" ? "#FFFFFF" : "#1C1C1E",
      },
      text: {
        primary: mode === "light" ? "#000000" : "#FFFFFF",
        secondary: mode === "light" ? "#3C3C43" : "#EBEBF5",
      },
      primary: {
        main: mode === "light" ? "#0071E3" : "#0A84FF",
      },
      warning: {
        main: '#ffeb3b',
        contrastText: '#000000',
      },
      divider: mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.15)",
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h6: { fontWeight: 600, letterSpacing: "-0.005em" },
      body1: { fontSize: "0.95rem", lineHeight: 1.5 },
      body2: { fontSize: "0.85rem" },
      button: { textTransform: "none", fontWeight: 500 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
              scrollbarColor: mode === "dark" ? "#424242 #1c1c1e" : "#d1d1d1 #f5f5f7",
          },
          "*::-webkit-scrollbar": { width: "10px", height: "10px" },
          "*::-webkit-scrollbar-track": { background: "transparent" },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#2C2C2E",
            backgroundImage: "none",
            border: `1px solid ${mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#000000" : "#FFFFFF",
            "&:hover": {
              backgroundColor: mode === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none", boxShadow: "none" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backdropFilter: "blur(20px)",
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(30, 30, 30, 0.9)",
            color: mode === "light" ? "#000" : "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  });

const GlobalStylesOverride = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <GlobalStyles
      styles={{
        'a, a:visited': {
          color: isDark ? '#409CFF !important' : '#0071E3 !important', 
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'opacity 0.2s',
        },
        'a:hover': {
          textDecoration: 'underline',
          opacity: 0.8,
        },
        '[style*="background-color: rgb(255, 255, 0)"], [style*="background-color: yellow"], .MuiAlert-standardWarning': {
            color: '#000000 !important',
        },
        'body': {
             color: isDark ? '#FFFFFF' : '#000000',
        }
      }}
    />
  );
};

const MeshGradient = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1,
                background: isDark 
                    ? `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                       radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
                       radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)`
                    : `radial-gradient(at 0% 0%, hsla(253,16%,90%,1) 0, transparent 50%), 
                       radial-gradient(at 50% 0%, hsla(225,39%,95%,1) 0, transparent 50%), 
                       radial-gradient(at 100% 0%, hsla(339,49%,90%,1) 0, transparent 50%)`,
                filter: 'blur(60px)', opacity: 0.8,
            }}
        />
    )
}

// Map category names to color styles
// Each category has a defined dark and light mode color
const CATEGORY_COLORS: Record<string, { dark: string; light: string }> = {
    psychedelic: { dark: "#30D158", light: "#34C759" },
    stimulant: { dark: "#40CBE0", light: "#32ADE6" },
    depressant: { dark: "#FF453A", light: "#FF3B30" },
    dissociative: { dark: "#BF5AF2", light: "#AF52DE" },
    benzodiazepine: { dark: "#FF375F", light: "#FF2D55" },
    opioid: { dark: "#30D158", light: "#28CD41" },
    cannabinoid: { dark: "#30DB5B", light: "#30D158" },
    common: { dark: "#5E5CE6", light: "#5856D6" },
    "research-chemical": { dark: "#FF9F0A", light: "#FF9500" },
};

const getCategoryStyle = (cat: string, isDark: boolean) => {
    const colorSet = CATEGORY_COLORS[cat];
    if (!colorSet) return isDark ? "#8E8E93" : "#8E8E93";
    return isDark ? colorSet.dark : colorSet.light;
}

const formatCategory = (text: string) => text.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Styles and renders category pills
// Highlighting based on category mapping with theme support
const CategoryPills = memo(({ text, mode }: { text: string | undefined; mode: string }) => {
  if (!text) return null;
  // Split the input text into individual words
  const words = text.split(", ");
  const isDark = mode === 'dark';

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
      {words.map((word, index) => {
        // Remove the comma, we need to keep hyphens though:
        const cleanWord = word.trim().toLowerCase();
        
        const baseColor = getCategoryStyle(cleanWord, isDark);
        const definition = (dictionary as Record<string, string>)[cleanWord];

        return (
            <Tooltip title={definition || ""} key={`${word}-${index}`} arrow disableInteractive>
              <Chip
                label={formatCategory(cleanWord)}
                size="small"
                sx={{
                    fontWeight: 600, 
                    fontSize: "0.7rem", 
                    height: "24px", 
                    borderRadius: "6px",
                    backgroundColor: alpha(baseColor, isDark ? 0.15 : 0.1),
                    color: baseColor, 
                    border: '1px solid transparent',
                    cursor: 'help',
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    "&:hover": { 
                        backgroundColor: alpha(baseColor, 0.25),
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${alpha(baseColor, 0.4)}`,
                        borderColor: alpha(baseColor, 0.3)
                    }
                }}
              />
            </Tooltip>
        );
      })}
    </Box>
  );
});

const ReadMoreCell = memo(({ text }: { text: string | undefined }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const content = useMemo(() => text ? addDictionaryDefs(text) : null, [text]);

  if (!text) return <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>No summary available</Typography>;
  const isLong = text.length > 200; 

  return (
    <Box onClick={(e) => {
        // Allow text selection without triggering row click
        if (window.getSelection()?.toString().length) {
            e.stopPropagation();
        }
    }}>
      <Typography
        variant="body2"
        color="text.primary" 
        component="div"
        sx={{
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          whiteSpace: 'normal', 
          wordBreak: 'break-word',
          lineHeight: 1.6,
          mb: isLong ? 0.5 : 0,
          '& a': {
            color: isDark ? '#409CFF' : '#0071E3',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline' }
          }
        }}
      >
        {content}
      </Typography>
      {isLong && (
          <Button
            size="small"
            disableRipple
            onClick={(e) => { 
                e.stopPropagation(); // Only stop propagation on the button
                setExpanded(!expanded); 
            }}
            sx={{
              p: 0, minWidth: "auto", fontSize: "0.8rem", height: 'auto',
              color: "primary.main",
              "&:hover": { background: "transparent", textDecoration: "underline" }
            }}
          >
            {expanded ? "Show Less" : "Read More"}
          </Button>
      )}
    </Box>
  );
});

// This appears at the top and can contain any information you want
// We can use this for announcements or updates
const InfoBar = () => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 3, width: "100%" }}>
      {/* We use the accordion item to make it collapsible */}
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          borderRadius: "16px !important",
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(20px) saturate(180%)",
          border: `1px solid ${theme.palette.divider}`,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ opacity: 0.5 }} />} sx={{ minHeight: 64, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Box sx={{ 
                 width: 36, height: 36, borderRadius: '10px', 
                 bgcolor: alpha(theme.palette.primary.main, 0.15), 
                 color: theme.palette.primary.main,
                 display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
                 <BiotechIcon fontSize="small" />
             </Box>
             <Box>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>TripSit Database</Typography>
                <Typography variant="caption" color="text.secondary">Harm reduction factsheets</Typography>
             </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 650, mb: 2 }}>
                TripSit&apos;s factsheets are meticulously crafted to deliver clear, concise, and reliable information about various substances. Primarily designed for educational purposes, these factsheets should not be interpreted as medical advice.
                <br /><br />
                <b>Your safety is paramount. We encourage you verify information from multiple sources before making decisions about substance use.</b>
                <br /><br />
                The content presented here is sourced from our comprehensive <a href="https://github.com/tripsit/drugs">drug database</a>. If you notice something that needs updating or have additional information, please <a href="https://github.com/TripSit/drugs/issues">submit an issue</a> along with your sources. We&apos;re committed to keeping our data accurate and up-to-date.
                <br /><br />
                Are you a web developer with ideas to enhance this page? Great news – it&apos;s open source! Dive into our <a href="https://github.com/tripsit/website">GitHub repo</a> and contribute to the evolution of this resource. Your expertise can make a significant impact!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
               <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <KofiButton color={theme.palette.primary.main} title="Donate" kofiID="J3J5NOJCE" />
                <Box sx={{ transform: "scale(0.9)" }}><PatreonButton /></Box>
                <Box sx={{ transform: "scale(0.9)" }}><GithubButton /></Box>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const AppleSearchBar = ({ 
    value, 
    onChange, 
}: { 
    value: string, 
    onChange: (val: string) => void, 
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Paper
            elevation={0}
            component="form"
            onSubmit={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.focus()}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 480,
                height: 40,
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(118, 118, 128, 0.24)' : 'rgba(118, 118, 128, 0.12)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid transparent',
                px: 1.5,
                cursor: 'text',
                '&:focus-within': {
                    backgroundColor: isDark ? '#000' : '#fff',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
                    border: `1px solid ${theme.palette.primary.main}`,
                }
            }}
        >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1, opacity: 0.7 }} />
            <InputBase
                inputRef={inputRef}
                sx={{ 
                    flex: 1, 
                    fontSize: '15px', 
                    color: 'text.primary',
                    '& input::placeholder': { color: 'text.secondary', opacity: 0.8 }
                }}
                placeholder="Search substance..."
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </Paper>
    );
};

const FactsheetsTable = () => {
    const { toggleColorMode } = useContext(ColorModeContext);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 50, 
    });

    const { data: rawData = [], isError, isRefetching, isLoading, refetch } = useQuery({
        queryKey: ["table-data"],
        queryFn: async () => {
          // TripSit's drug database file
          // This is fetched every time the user loads the page to ensure they have the latest data
          const response = await fetch("https://raw.githubusercontent.com/TripSit/drugs/main/drugs.json");
          const json = await response.json();
          return Object.values(json) as Drug[];
        },
        placeholderData: keepPreviousData,
        staleTime: Infinity,
    });

    const data = useMemo(() => rawData, [rawData]);

    // If you want to debug a specific drug, change the below variable to the name of the drug
    // and then use the commented-out code below that to display what you need to debug
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const debugDrug = "cocaine";
    // if (drugData.original.name === debugDrug) {
    //   console.log(`roaString: ${JSON.stringify(roaString, null, 2)}`);
    // }

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
          if (containerRefElement) {
            const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
            if (scrollHeight - scrollTop - clientHeight < 1000) {
                if (pagination.pageSize < data.length) {
                    setPagination((prev) => ({
                        ...prev,
                        pageSize: prev.pageSize + 50,
                    }));
                }
            }
          }
        },
        [pagination.pageSize, data.length],
    );

    useEffect(() => {
        const ref = tableContainerRef.current;
        const handler = () => fetchMoreOnBottomReached(ref);
        if (ref) ref.addEventListener('scroll', handler);
        return () => { if (ref) ref.removeEventListener('scroll', handler); };
    }, [fetchMoreOnBottomReached]);


    // Define the columns
    const columns = useMemo<MRT_ColumnDef<Drug>[]>(
        // column definitions...
        () => [
          {
            accessorKey: "pretty_name",
            header: "Substance",
            size: 130, // This is the default value, but it stops the column from changing when the table is resized
            Cell: ({ cell }) => (
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: 'text.primary' }}>
                {cell.getValue<string>()}
              </Typography>
            ),
          },
          {
            accessorFn: (row) => row.aliases?.join(", ") || "",
            id: "aliases",
            header: "Aliases",
            size: 90, // This is the default value, but it stops the column from changing when the table is resized
            maxSize: 100,
            Cell: ({ cell }) => (
              <Typography variant="body2" color="text.secondary" noWrap sx={{ opacity: 0.8 }}>
                {cell.getValue<string>()}
              </Typography>
            ),
          },
          {
            accessorFn: (row) => row.properties.categories?.join(", "),
            id: "categories",
            header: "Category",
            size: 140, // This is the default value, but it stops the column from changing when the table is resized
            Cell: ({ cell }) => <CategoryPills text={cell.getValue<string | undefined>()} mode={theme.palette.mode} />,
          },
          {
            accessorFn: (row) => row.properties.summary,
            id: "summary",
            header: "Quick Fact",
            grow: true,
            minSize: 300,
            maxSize: 1000, // Make this one bigger because of the long text
            Cell: ({ cell }) => <ReadMoreCell text={cell.getValue<string | undefined>()} />,
          },
        ],
        [theme.palette.mode]
    );
    
    const table = useMaterialReactTable({
        columns,
        data,
        enableStickyHeader: true,
        enableTopToolbar: true,
        enableToolbarInternalActions: false, 
        
        enableGlobalFilter: true,
        enableGlobalFilterRankedResults: true, 
        onGlobalFilterChange: setGlobalFilter,
        autoResetPageIndex: true, 

        enableColumnFilters: false,
        enableDensityToggle: false, // Need to fix density stuff
        enableHiding: false,
        enablePagination: true,
        enableBottomToolbar: false, 
        
        state: { 
            isLoading, 
            showAlertBanner: isError, 
            showProgressBars: isRefetching, 
            globalFilter,
            pagination,
            sorting,
        },
        onPaginationChange: setPagination, 
        onSortingChange: setSorting,

        enableExpandAll: false,
        positionExpandColumn: 'first',
        muiTableBodyRowProps: ({ row }) => ({
            onClick: (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('a')) {
                    return;
                }
                row.toggleExpanded();
            },
            sx: {
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: row.getIsExpanded() ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.08 : 0.04),
              },
            },
        }),
        displayColumnDefOptions: {
            'mrt-row-expand': {
                header: '',
                size: 40,
                Cell: ({ row }) => (
                     <IconButton 
                        onClick={(e) => {
                            e.stopPropagation();
                            row.toggleExpanded();
                        }}
                        size="small" 
                        sx={{ 
                            opacity: 0.6,
                            transition: 'transform 0.2s',
                            transform: row.getIsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)'
                        }}
                    >
                        <KeyboardArrowRightIcon /> 
                   </IconButton>
                )
            },
        },
        muiTableContainerProps: {
            ref: tableContainerRef, 
            sx: { 
                maxHeight: 'calc(100vh - 220px)',
                borderRadius: '0 0 16px 16px',
            } 
        },
        muiTablePaperProps: {
          elevation: 0,
          sx: {
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: theme.shadows[1],
            overflow: "hidden",
            height: 'calc(100vh - 120px)', // This value seems to work the best
            display: 'flex', flexDirection: 'column'
          },
        },
        muiTableHeadCellProps: {
          sx: {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(10px)",
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.8rem",
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 2,
          },
        },
        muiTableBodyCellProps: {
          sx: { 
              borderBottom: `1px solid ${theme.palette.divider}`, 
              py: 1.5,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              color: 'text.primary', 
          },
        },
        muiToolbarAlertBannerProps: isError
        ? {
            color: "error",
            children: "Error loading data",
          }
        : undefined,
        renderTopToolbar: () => (
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()} size="small" sx={{ 
                           bgcolor: alpha(theme.palette.text.secondary, 0.1),
                           '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.2) }
                        }}>
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
                        <IconButton onClick={toggleColorMode} size="small" sx={{ 
                           bgcolor: alpha(theme.palette.text.secondary, 0.1),
                           '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.2) }
                        }}>
                            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <AppleSearchBar 
                        value={globalFilter ?? ''}
                        onChange={(val) => setGlobalFilter(val)} 
                    />
                </Box>
                <Box sx={{ width: 88, display: { xs: 'none', md: 'block' } }} />
            </Box>
        ),
        renderDetailPanel: ({ row }) => (
            <Collapse in={row.getIsExpanded()} timeout="auto" unmountOnExit>
                <Box sx={{ 
                    p: 3, 
                    width: '100%',
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(242,242,247,0.5)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}>
                  {row.original ? DrugInfoCard({ drugData: row.original }) : <Typography>No details.</Typography>}
                </Box>
            </Collapse>
        ),
    });

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1800, margin: "0 auto", position: 'relative', zIndex: 1 }}>
          <InfoBar />
          <MaterialReactTable table={table} />
        </Box>
    );
}

const AppWrapper = () => {
  // App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("tripsit-theme");
        if (saved === "light" || saved === "dark") setMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tripsit-theme", mode);
  }, [mode]);

  const colorMode = useMemo(() => ({
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
  }), []);

  const theme = useMemo(() => getAppleTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStylesOverride />
        <MeshGradient />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <QueryClientProvider client={new QueryClient()}>
                <FactsheetsTable />
            </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppWrapper;
