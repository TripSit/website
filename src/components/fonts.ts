import { Inter, Poppins, Space_Grotesk } from "next/font/google";

// tailwind.css maps font-body / font-display to these CSS variables, so any
// page using those utilities needs fontVariables on an ancestor element
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const fontVariables = `${inter.variable} ${grotesk.variable}`;

// The combo checker's text font. comboChecker.module.css reads it as var(--font-poppins).
// next/font serves it from this site, so visitors don't load it from Google.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const poppinsVariable = poppins.variable;
