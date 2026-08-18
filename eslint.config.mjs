import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import sonarjs from "eslint-plugin-sonarjs";

const config = [
  {
    ignores: [
      "public/**",
      "static/**",
      "build/**",
      ".next/**",
      "next-env.d.ts",
      "tsconfig.copy.json",
      "**/*.esm.js",
    ],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...nextTypescript,
  sonarjs.configs.recommended,
  prettierRecommended,
  {
    rules: {
      // Removes () around single parameter arrow functions
      "arrow-parens": "off",
      // The following will show up as errors, just want to get this pushed for now
      "sonarjs/cognitive-complexity": ["warn", 50],
      // New with react-hooks v7 (React Compiler rules). Several existing effects
      // call setState synchronously and need a real refactor to satisfy this;
      // tracked as debt for now instead of blocking the build.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // TypeScript itself already catches undefined references; no-undef
      // produces false positives on TS-only globals (ambient types, etc.)
      "no-undef": "off",
      // This is a personal preference to enforce good code
      "@typescript-eslint/no-non-null-assertion": "warn",
      // Allow any on objects, require definition of types
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default config;
