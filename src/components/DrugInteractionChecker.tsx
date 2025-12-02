/* eslint-disable no-underscore-dangle */
import React, { useMemo, useState, createContext } from "react";
import {
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
  Button,
  useTheme,
  InputBase,
  Paper,
  GlobalStyles,
  Grid,
  Card,
  CardContent,
  Link,
  Zoom,
  Fade,
  Grow,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  AppBar,
  Toolbar,
  Container,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListSubheader
} from "@mui/material";

// Standard MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ScienceIcon from "@mui/icons-material/Science";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BiotechIcon from "@mui/icons-material/Biotech";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import Data
import combosDataRaw from './combos.json';

// --- TYPES ---
interface Source { author?: string; title?: string; url?: string; }
interface Interaction { status: string; note?: string; sources?: Source[]; }
interface DrugData { [key: string]: { [key: string]: Interaction; }; }

const combosData = combosDataRaw as DrugData;

// --- DEFINITIONS ---
const RISK_DEFINITIONS = [
  {
    label: "Low Risk & Synergy",
    status: "Low Risk & Synergy",
    desc: "These drugs work together to cause an effect greater than the sum of its parts, and they aren't likely to cause an adverse or undesirable reaction when used carefully. Additional research should always be done before combining drugs."
  },
  {
    label: "Low Risk & No Synergy",
    status: "Low Risk & No Synergy",
    desc: "Effects are additive. The combination is unlikely to cause any adverse or undesirable reaction beyond those that might ordinarily be expected from these drugs."
  },
  {
    label: "Low Risk & Decrease",
    status: "Low Risk & Decrease",
    desc: "Effects are subtractive. The combination is unlikely to cause any adverse or undesirable reaction beyond those that might ordinarily be expected from these drugs."
  },
  {
    label: "Caution",
    status: "Caution",
    desc: "These combinations are not usually physically harmful, but may produce undesirable effects, such as physical discomfort or overstimulation. Extreme use may cause physical health issues. Synergistic effects may be unpredictable. Care should be taken when choosing to use this combination."
  },
  {
    label: "Unsafe",
    status: "Unsafe",
    desc: "There is considerable risk of physical harm when taking these combinations, they should be avoided where possible."
  },
  {
    label: "Dangerous",
    status: "Dangerous",
    desc: "These combinations are considered extremely harmful and should always be avoided. Reactions to these drugs taken in combination are highly unpredictable and have a potential to cause death."
  },
  {
    label: "Unknown",
    status: "Unknown",
    desc: "Effects are unknown."
  }
];

// --- THEME ---
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
        primary: mode === "light" ? "#1D1D1F" : "#F5F5F7",
        secondary: mode === "light" ? "#86868B" : "#A1A1A6",
      },
      primary: { main: mode === "light" ? "#0071E3" : "#2997FF" },
      divider: mode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.12)",
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h3: { fontWeight: 800, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.01em" },
      body1: { fontSize: "1rem", lineHeight: 1.6 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 20 },
    components: {
      MuiCssBaseline: { 
        styleOverrides: { 
          body: { backgroundColor: mode === "light" ? "#F5F5F7" : "#000000" },
          "*::-webkit-scrollbar": { width: "8px", height: "8px" },
          "*::-webkit-scrollbar-track": { background: "transparent" },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            borderRadius: "10px",
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
          },
        } 
      },
      MuiButton: { styleOverrides: { root: { borderRadius: 14, padding: "8px 16px", boxShadow: "none", "&:hover": { boxShadow: "none" } } } },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(28, 28, 30, 0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }
        }
      }
    }
  });

const MeshGradient = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1,
            background: isDark 
                ? `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,15%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,15%,1) 0, transparent 50%)`
                : `radial-gradient(at 0% 0%, hsla(210,100%,98%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(220,100%,96%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(340,100%,98%,1) 0, transparent 50%)`,
            filter: 'blur(80px)', opacity: 1,
        }} />
    )
}

// --- CLASSIC TRIPSIT HEADER COMPONENT ---
const TripSitHeader = ({ toggleColorMode, mode }: { toggleColorMode: () => void, mode: 'light' | 'dark' }) => {
    const [anchorElResources, setAnchorElResources] = useState<null | HTMLElement>(null);
    const [anchorElGuides, setAnchorElGuides] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleOpenResources = (event: React.MouseEvent<HTMLElement>) => setAnchorElResources(event.currentTarget);
    const handleCloseResources = () => setAnchorElResources(null);
    
    const handleOpenGuides = (event: React.MouseEvent<HTMLElement>) => setAnchorElGuides(event.currentTarget);
    const handleCloseGuides = () => setAnchorElGuides(null);

    // Style mimicking the bootstrap header provided
    const navLinkStyle = {
        color: '#rgba(255,255,255,0.85)',
        textDecoration: 'none',
        fontWeight: 400,
        fontSize: '1rem',
        mx: 1.5,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        '&:hover': { color: '#ffffff', opacity: 1 }
    };

    const logoUrl = "https://tripsit.me/wp-content/uploads/2018/08/tripsit-logo-v7.png";

    return (
        <AppBar position="fixed" sx={{ bgcolor: '#212529', boxShadow: 'none', borderBottom: '1px solid #333', zIndex: 1201 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ minHeight: '70px', justifyContent: 'space-between' }}>
                    
                    {/* Logo */}
                    <Link href="https://tripsit.me" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Box component="img" src={logoUrl} alt="TripSit" sx={{ height: 35 }} />
                    </Link>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', xl: 'flex' }, alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                        <Link href="https://tripsit.me#hero" sx={{ ...navLinkStyle, color: '#fff' }}>Home</Link>
                        <Link href="https://tripsit.me#about" sx={navLinkStyle}>About</Link>

                        {/* Resources Dropdown */}
                        <Box>
                            <Link sx={navLinkStyle} onClick={handleOpenResources}>
                                Resources <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                            </Link>
                            <Menu
                                anchorEl={anchorElResources}
                                open={Boolean(anchorElResources)}
                                onClose={handleCloseResources}
                                PaperProps={{ sx: { bgcolor: '#212529', color: '#fff', mt: 1, minWidth: 220, border: '1px solid #444' } }}
                                MenuListProps={{ sx: { py: 0 } }}
                            >
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px', mt: 1 }}>Drug Info</ListSubheader>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/Main_Page" sx={{ fontSize: '0.9rem' }}>Wiki</MenuItem>
                                <MenuItem component="a" href="https://tripsit.me/factsheets" sx={{ fontSize: '0.9rem' }}>Factsheets</MenuItem>
                                <MenuItem component="a" href="https://combo.tripsit.me" sx={{ fontSize: '0.9rem' }}>Comboapp</MenuItem>
                                <MenuItem component="a" href="https://tripsit.me#faq" sx={{ fontSize: '0.9rem' }}>Printing Information</MenuItem>
                                <MenuItem component="a" href="https://www.reddit.com/r/Drugs/comments/131q1yb/the_drug_users_bible_download_it_free_of_charge/" sx={{ fontSize: '0.9rem' }}>Drug User's Handbook</MenuItem>
                                
                                <Divider sx={{ bgcolor: '#444' }} />
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px' }}>Calculators</ListSubheader>
                                <MenuItem component="a" href="https://dxm.tripsit.me" sx={{ fontSize: '0.9rem' }}>DXM Dosage</MenuItem>
                                <MenuItem component="a" href="https://volume.tripsit.me" sx={{ fontSize: '0.9rem' }}>Volumetric</MenuItem>
                                <MenuItem component="a" href="https://benzos.tripsit.me" sx={{ fontSize: '0.9rem' }}>Benzo Conversion</MenuItem>

                                <Divider sx={{ bgcolor: '#444' }} />
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px' }}>Test Kits</ListSubheader>
                                <MenuItem component="a" href="https://dancesafe.org/product-category/testing-strips/" sx={{ fontSize: '0.9rem' }}>DanceSafe (Worldwide)</MenuItem>
                                <MenuItem component="a" href="https://protestkit.eu/shop/?coupon_code=tripsit" sx={{ fontSize: '0.9rem' }}>ProTest (Europe)</MenuItem>
                                
                                <Divider sx={{ bgcolor: '#444' }} />
                                <MenuItem component="a" href="https://learn.tripsit.me" sx={{ fontSize: '0.9rem', mt: 1 }}>Learning Platform</MenuItem>
                                <MenuItem component="a" href="https://play.google.com/store/apps/details?id=me.tripsit.mobile&hl=en_US&gl=US" sx={{ fontSize: '0.9rem' }}>Android App</MenuItem>
                                <MenuItem component="a" href="https://uptime.tripsit.me/status/default" sx={{ fontSize: '0.9rem' }}>Service Status</MenuItem>
                            </Menu>
                        </Box>

                        {/* Guides Dropdown */}
                        <Box>
                            <Link sx={navLinkStyle} onClick={handleOpenGuides}>
                                Guides <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                            </Link>
                            <Menu
                                anchorEl={anchorElGuides}
                                open={Boolean(anchorElGuides)}
                                onClose={handleCloseGuides}
                                PaperProps={{ sx: { bgcolor: '#212529', color: '#fff', mt: 1, minWidth: 220, border: '1px solid #444' } }}
                                MenuListProps={{ sx: { py: 0 } }}
                            >
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px', mt: 1 }}>Harm Reduction</ListSubheader>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/Common_Misconceptions_About_Psychedelics" sx={{ fontSize: '0.9rem' }}>Psychedelic Myths</MenuItem>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/Test_Kits" sx={{ fontSize: '0.9rem' }}>Test Kits</MenuItem>

                                <Divider sx={{ bgcolor: '#444' }} />
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px' }}>TripSitting</ListSubheader>
                                <MenuItem component="a" href="https://learn.tripsit.me" sx={{ fontSize: '0.9rem' }}>Intro to TripSitting</MenuItem>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/How_To_Tripsit_In_Real_Life" sx={{ fontSize: '0.9rem' }}>TripSit in Real Life</MenuItem>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/How_To_Deal_With_A_Bad_Trip" sx={{ fontSize: '0.9rem' }}>Deal with a Bad Trip</MenuItem>

                                <Divider sx={{ bgcolor: '#444' }} />
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px' }}>Recovery</ListSubheader>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/Quick_Guide_to_Stimulant_Comedowns" sx={{ fontSize: '0.9rem' }}>Stimulant Comedowns</MenuItem>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/Guide_to_Withdrawals" sx={{ fontSize: '0.9rem' }}>Withdrawals</MenuItem>

                                <Divider sx={{ bgcolor: '#444' }} />
                                <ListSubheader sx={{ bgcolor: 'transparent', color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, lineHeight: '30px' }}>Dosing</ListSubheader>
                                <MenuItem component="a" href="https://wiki.tripsit.me/wiki/Quick_Guide_to_Volumetric_Dosing" sx={{ fontSize: '0.9rem' }}>Volumetric Dosing</MenuItem>
                            </Menu>
                        </Box>

                        <Link href="https://tripsit.me#cta" sx={navLinkStyle}>Volunteer</Link>
                        <Link href="https://tripsit.me#faq" sx={navLinkStyle}>FAQ</Link>
                        <Link href="https://updates.tripsit.me" sx={navLinkStyle}>Updates</Link>
                        <Link href="https://tripsit.me/appeal" sx={navLinkStyle}>Ban Appeal</Link>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            href="https://discord.gg/tripsit"
                            sx={{ 
                                bgcolor: '#5865F2', // Discord Blurple
                                color: '#ffffff',
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 2,
                                '&:hover': { bgcolor: '#4752c4' }
                            }}
                        >
                            Join Discord
                        </Button>
                        <Button 
                            variant="contained" 
                            href="https://tripsit.me/webchat"
                            sx={{ 
                                bgcolor: '#0d6efd', // Bootstrap Primary Blue
                                color: '#ffffff',
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 2,
                                '&:hover': { bgcolor: '#0b5ed7' }
                            }}
                        >
                            Start Webchat
                        </Button>
                        
                        {/* Subtle Theme Toggle */}
                        <Tooltip title="Toggle Light/Dark Mode">
                            <IconButton onClick={toggleColorMode} sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}>
                                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ display: { xs: 'flex', xl: 'none' }, alignItems: 'center' }}>
                         <IconButton onClick={toggleColorMode} sx={{ color: '#aaa', mr: 1 }}>
                            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                        </IconButton>
                        <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{ sx: { width: 300, bgcolor: '#212529', color: 'white' } }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </Box>
                <List>
                    <ListItemButton component="a" href="https://tripsit.me"><ListItemText primary="Home" /></ListItemButton>
                    <ListItemButton component="a" href="https://tripsit.me#about"><ListItemText primary="About" /></ListItemButton>
                    <ListItemButton onClick={() => setAnchorElResources(anchorElResources ? null : document.body)}>
                        <ListItemText primary="Resources" />
                        <ChevronRightIcon fontSize="small" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setAnchorElGuides(anchorElGuides ? null : document.body)}>
                        <ListItemText primary="Guides" />
                        <ChevronRightIcon fontSize="small" />
                    </ListItemButton>
                    <Divider sx={{ bgcolor: '#444', my: 1 }} />
                    <ListItemButton component="a" href="https://discord.gg/tripsit" sx={{ bgcolor: '#5865F2', mx: 2, borderRadius: 1, my: 1, '&:hover': { bgcolor: '#4752c4' } }}>
                        <ListItemText primary="Join Discord" sx={{ textAlign: 'center', fontWeight: 'bold' }} />
                    </ListItemButton>
                    <ListItemButton component="a" href="https://tripsit.me/webchat" sx={{ bgcolor: '#0d6efd', mx: 2, borderRadius: 1, '&:hover': { bgcolor: '#0b5ed7' } }}>
                        <ListItemText primary="Start Webchat" sx={{ textAlign: 'center', fontWeight: 'bold' }} />
                    </ListItemButton>
                </List>
            </Drawer>
        </AppBar>
    );
};

// --- RISK HELPERS ---
const RISK_COLORS: Record<string, { dark: string; light: string; bgLight: string; bgDark: string; icon: React.ElementType }> = {
    "Low Risk": { dark: "#30D158", light: "#34C759", bgLight: "#E8FBEB", bgDark: "rgba(48, 209, 88, 0.15)", icon: CheckCircleOutlineIcon },
    "Caution": { dark: "#FFD60A", light: "#FFCC00", bgLight: "#FFFBE6", bgDark: "rgba(255, 214, 10, 0.15)", icon: WarningAmberIcon },
    "Unsafe": { dark: "#FF9F0A", light: "#FF9500", bgLight: "#FFF5E6", bgDark: "rgba(255, 159, 10, 0.15)", icon: ReportProblemIcon },
    "Dangerous": { dark: "#FF453A", light: "#FF3B30", bgLight: "#FFEBEA", bgDark: "rgba(255, 69, 58, 0.15)", icon: DangerousIcon },
    "Unknown": { dark: "#8E8E93", light: "#8E8E93", bgLight: "#F2F2F7", bgDark: "rgba(142, 142, 147, 0.15)", icon: ScienceIcon },
};

const getRiskStyle = (status: string, isDark: boolean) => {
    const key = Object.keys(RISK_COLORS).find(k => status.toLowerCase().includes(k.toLowerCase())) || "Unknown";
    return RISK_COLORS[key];
}

// --- RISK GUIDE MODAL ---
const RiskLegendModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth 
            TransitionComponent={Zoom}
            sx={{ '& .MuiDialogContent-root': { scrollbarColor: 'auto' }, zIndex: 1300 }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Typography variant="h5" fontWeight={800}>Risk Guide</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {RISK_DEFINITIONS.map((def, idx) => {
                        const style = getRiskStyle(def.status, isDark);
                        const Icon = style.icon;
                        return (
                            <Grid item xs={12} sm={6} key={idx}>
                                <Paper elevation={0} sx={{ 
                                    p: 2.5, height: '100%', borderRadius: 4, 
                                    border: `1px solid ${alpha(style.dark, 0.2)}`,
                                    bgcolor: alpha(style.bgDark, 0.3)
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                        <Icon sx={{ color: isDark ? style.dark : style.light }} />
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: isDark ? style.dark : style.light }}>{def.label}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{def.desc}</Typography>
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

// --- MAIN COMPONENTS ---

const AnalyzerCard = ({ result, selectedDrugs, onReset }: { result: any, selectedDrugs: string[], onReset: () => void }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    // Pulse Animation for the icon
    const iconAnimation = {
        '@keyframes pulse': {
            '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.background.paper, 0.7)}` },
            '70%': { boxShadow: `0 0 0 10px ${alpha(theme.palette.background.paper, 0)}` },
            '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.background.paper, 0)}` },
        }
    };

    return (
        // "Suck Away" Animation: Collapse with a slower duration for drama
        <Collapse 
            in={!!result && selectedDrugs.length === 2} 
            timeout={600} 
            unmountOnExit
            sx={{ transformOrigin: 'top' }}
        >
            {result && (
                <Grow in={true} timeout={600}>
                    <Card sx={{ 
                        borderRadius: '28px',
                        background: isDark ? 'rgba(28, 28, 30, 0.7)' : 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: "blur(30px) saturate(180%)",
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: isDark 
                            ? `0 20px 50px -10px ${alpha(getRiskStyle(result.status, isDark).dark, 0.2)}` 
                            : `0 20px 50px -10px ${alpha(getRiskStyle(result.status, isDark).light, 0.3)}`,
                        overflow: 'visible',
                        mb: 4
                    }}>
                        <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                            {(() => {
                                const style = getRiskStyle(result.status, isDark);
                                const Icon = style.icon;
                                return (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                        {/* Animated Icon */}
                                        <Box sx={{ 
                                            display: 'inline-flex', p: 2, borderRadius: '50%', mb: 2,
                                            bgcolor: style.bgDark, color: isDark ? style.dark : style.light,
                                            animation: 'pulse 2s infinite',
                                            ...iconAnimation
                                        }}>
                                            <Icon sx={{ fontSize: 56 }} />
                                        </Box>
                                        
                                        <Typography variant="h3" sx={{ color: isDark ? style.dark : style.light, mb: 1, textShadow: `0 0 20px ${alpha(isDark ? style.dark : style.light, 0.3)}` }}>
                                            {result.status}
                                        </Typography>
                                        
                                        {/* Centered Bubble */}
                                        <Box sx={{ 
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, 
                                            bgcolor: theme.palette.action.hover, 
                                            px: 3, py: 1, borderRadius: 100,
                                            maxWidth: '100%', flexWrap: 'wrap'
                                        }}>
                                            <Typography variant="h6" color="text.primary" sx={{ 
                                                textTransform: 'capitalize', whiteSpace: 'nowrap', lineHeight: 1 
                                            }}>
                                                {selectedDrugs[0]}
                                            </Typography>
                                            <SwapHorizIcon color="action" fontSize="small" />
                                            <Typography variant="h6" color="text.primary" sx={{ 
                                                textTransform: 'capitalize', whiteSpace: 'nowrap', lineHeight: 1 
                                            }}>
                                                {selectedDrugs[1]}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })()}

                            <Paper elevation={0} sx={{ 
                                p: 3, borderRadius: '18px', textAlign: 'left',
                                bgcolor: isDark ? alpha('#000', 0.2) : alpha('#000', 0.04),
                                border: `1px solid ${theme.palette.divider}`
                            }}>
                                <Typography variant="body1" color="text.primary">
                                    {result.note || "No specific note available."}
                                </Typography>
                            </Paper>

                            {/* Sources Dropdown */}
                            {result.sources && result.sources.length > 0 && (
                                <Accordion elevation={0} sx={{ bgcolor: 'transparent', mt: 2, '&:before': { display: 'none' } }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, minHeight: 0 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            Sources ({result.sources.length})
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0, pt: 1 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {result.sources.map((s: Source, i: number) => (
                                                <Link key={i} href={s.url} target="_blank" rel="noopener" underline="none" sx={{ 
                                                    display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2,
                                                    color: 'primary.main', fontSize: '0.85rem',
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                                }}>
                                                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                                                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title || "Reference Link"}</Box>
                                                </Link>
                                            ))}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            )}

                            <Button onClick={onReset} fullWidth variant="outlined" startIcon={<RefreshIcon />} sx={{ mt: 3, py: 1.5, borderColor: theme.palette.divider, color: 'text.secondary' }}>
                                Analyze Another
                            </Button>
                        </CardContent>
                    </Card>
                </Grow>
            )}
        </Collapse>
    );
};

const InteractionChecker = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [legendOpen, setLegendOpen] = useState(false);

    const allDrugs = useMemo(() => Object.keys(combosData).sort(), []);
    const filteredDrugs = useMemo(() => {
        if (!searchTerm) return allDrugs;
        return allDrugs.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allDrugs, searchTerm]);

    const handleDrugClick = (drug: string) => {
        if (selectedDrugs.includes(drug)) {
            setSelectedDrugs(prev => prev.filter(d => d !== drug));
        } else {
            if (selectedDrugs.length < 2) {
                setSelectedDrugs(prev => [...prev, drug]);
            } else {
                setSelectedDrugs(prev => [prev[0], drug]);
            }
        }
    };

    const result = useMemo(() => {
        if (selectedDrugs.length !== 2) return null;
        const [a, b] = selectedDrugs;
        let interaction = combosData[a]?.[b];
        if (!interaction) interaction = combosData[b]?.[a];
        if (!interaction) return { status: "Unknown", note: "No specific data found." };
        return interaction;
    }, [selectedDrugs]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: 12, md: 14 }, maxWidth: 1600, margin: "0 auto" }}>
            
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between', alignItems: {md: 'center'}, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                        width: 48, height: 48, borderRadius: '14px', 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <BiotechIcon />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ letterSpacing: '-0.5px' }}>Combo Matrix</Typography>
                        <Typography variant="body2" color="text.secondary">Drug Interaction Analyzer</Typography>
                    </Box>
                </Box>
                
                <Button 
                    onClick={() => setLegendOpen(true)}
                    variant="outlined"
                    startIcon={<InfoOutlinedIcon />}
                    sx={{ 
                        borderColor: theme.palette.divider, color: 'text.secondary',
                        bgcolor: alpha(theme.palette.background.paper, 0.5), backdropFilter: 'blur(10px)',
                        '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.8), borderColor: 'text.primary', color: 'text.primary' }
                    }}
                >
                    Risk Guide
                </Button>
            </Box>

            <RiskLegendModal open={legendOpen} onClose={() => setLegendOpen(false)} />

            {/* Layout */}
            <Grid container spacing={4} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                
                {/* LEFT: Analyzer */}
                <Grid item xs={12} md={5} lg={4} sx={{ 
                    position: { md: 'sticky' }, 
                    top: 100, 
                    height: 'fit-content', 
                    order: { xs: 1, md: 1 }, 
                    zIndex: 10 
                }}>
                    <AnalyzerCard 
                        result={result} 
                        selectedDrugs={selectedDrugs} 
                        onReset={() => setSelectedDrugs([])} 
                    />
                    
                    {/* Prompt when empty */}
                    {!result && (
                        <Fade in={true}>
                            <Card sx={{ 
                                borderRadius: '24px',
                                background: alpha(theme.palette.background.paper, 0.4),
                                backdropFilter: "blur(20px)",
                                border: `2px dashed ${theme.palette.divider}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                p: 4
                            }}>
                                <Box sx={{ textAlign: 'center', opacity: 0.6 }}>
                                    <ScienceIcon sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="h6">Ready to Analyze</Typography>
                                    <Typography variant="body2">
                                        Select <Box component="span" fontWeight="bold" color="primary.main">2 substances</Box> from the list.
                                    </Typography>
                                </Box>
                            </Card>
                        </Fade>
                    )}
                </Grid>

                {/* RIGHT: Grid */}
                <Grid item xs={12} md={7} lg={8} sx={{ order: { xs: 2, md: 2 } }}>
                    {/* Search Bar */}
                    <Box sx={{ 
                        position: 'sticky', top: {xs: 70, md: 80}, zIndex: 5, mb: 3,
                        bgcolor: alpha(theme.palette.background.default, 0.8),
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        p: 1
                    }}>
                        <Paper elevation={0} sx={{
                            display: 'flex', alignItems: 'center', width: '100%', height: 50, borderRadius: '12px',
                            bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                            px: 2, border: '1px solid transparent',
                            '&:focus-within': { bgcolor: theme.palette.background.paper, boxShadow: theme.shadows[2] }
                        }}>
                            <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
                            <InputBase 
                                sx={{ flex: 1, fontSize: '1rem' }} 
                                placeholder="Search substances..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </Paper>
                    </Box>

                    {filteredDrugs.length === 0 ? (
                        <Typography align="center" color="text.secondary" sx={{ mt: 8 }}>No substances found.</Typography>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1.5 }}>
                            {filteredDrugs.map((drug) => {
                                const isSelected = selectedDrugs.includes(drug);
                                const isDimmed = selectedDrugs.length === 2 && !isSelected;
                                return (
                                    <Zoom in={true} key={drug}>
                                        <Button
                                            onClick={() => handleDrugClick(drug)}
                                            variant={isSelected ? "contained" : "text"}
                                            sx={{
                                                justifyContent: 'flex-start', textAlign: 'left', 
                                                py: 1.5, px: 2, 
                                                borderRadius: '14px',
                                                textTransform: 'capitalize', fontSize: '0.9rem',
                                                minHeight: 50, 
                                                whiteSpace: 'normal',
                                                lineHeight: 1.2,
                                                wordBreak: 'break-word',
                                                
                                                bgcolor: isSelected ? 'primary.main' : alpha(theme.palette.background.paper, 0.6),
                                                color: isSelected ? '#fff' : 'text.primary',
                                                border: `1px solid ${isSelected ? 'transparent' : theme.palette.divider}`,
                                                opacity: isDimmed ? 0.3 : 1,
                                                
                                                // Spring Animation on Transform
                                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                                                
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                    bgcolor: isSelected ? 'primary.dark' : alpha(theme.palette.background.paper, 1),
                                                    // Specific Glow Color Request
                                                    borderColor: '#16507b',
                                                    boxShadow: '0 0 12px rgba(22, 80, 123, 0.6)'
                                                }
                                            }}
                                        >
                                            {drug.replace(/-/g, ' ')}
                                        </Button>
                                    </Zoom>
                                );
                            })}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

// --- APP WRAPPER ---
const DrugInteractionChecker = () => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getAppleTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={{ 
                'a': { textDecoration: 'none', transition: 'opacity 0.2s' },
                'a:hover': { opacity: 0.7 }
            }} />
            <MeshGradient />
            
            {/* New TripSit Header Component */}
            <TripSitHeader toggleColorMode={toggleColorMode} mode={mode} />

            <InteractionChecker />
        </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default DrugInteractionChecker;
