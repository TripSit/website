import type { Config } from "jest";

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to the Next.js app, used to load next.config.js and .env files.
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// next/jest merges in its own transform (SWC), moduleNameMapper (CSS/image
// mocks), and env loading on top of the config above.
export default createJestConfig(config);
