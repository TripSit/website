import type { Config } from "jest";

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to the Next.js app, used to load next.config.js and .env files.
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  // The factsheet and combo chart tests render whole pages (the full table, the 25x25 chart).
  // Alone they take about 2 s; with every suite running in parallel, 4-6 s, so the 5 s default
  // failed them at random under load.
  testTimeout: 15_000,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],
  coverageThreshold: {
    global: { branches: 90 },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/.github/",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// next/jest merges in its own transform (SWC), moduleNameMapper (CSS/image
// mocks), and env loading on top of the config above.
export default createJestConfig(config);
