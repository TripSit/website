import { Inter, Space_Grotesk } from "next/font/google";

// tailwind.css maps font-body / font-display to these CSS variables, so any
// page using those utilities needs fontVariables on an ancestor element
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const fontVariables = `${inter.variable} ${grotesk.variable}`;
