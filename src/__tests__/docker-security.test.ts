import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Docker build context security", () => {
  const read = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

  it("excludes local environment secrets from image build contexts", () => {
    const ignored = read(".dockerignore")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));

    expect(ignored).toContain(".env");
    expect(ignored).toContain(".env*.local");
  });

  it("runs the development image as the unprivileged node user", () => {
    const developmentStage = read("Dockerfile").split("FROM node:lts-alpine AS build")[0];
    expect(developmentStage).toMatch(/^USER node$/m);
  });
});
