/** @jest-environment node */
import { existsSync, readFileSync } from "node:fs";
import { chartProps, chartSnapshot } from "../comboChart.server";

jest.mock("node:fs", () => ({
  ...jest.requireActual("node:fs"),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

it("audits all 300 pairs, including DXM and both directions", () => {
  expect(chartSnapshot()).toEqual({
    digest: expect.stringMatching(/^[a-f0-9]{64}$/),
    audit: { pairs: 300, unknown: 0, conflicts: 0 },
  });
});

it("only offers files matching the current dataset and translations", () => {
  jest.mocked(existsSync).mockReturnValue(true);
  jest
    .mocked(readFileSync)
    .mockReturnValue(
      JSON.stringify({ languages: { en: { digest: chartSnapshot().digest } } }),
    );
  expect(chartProps("en").downloads).toEqual({
    png: "/assets/combo/png/drug-combinations-en.png",
    pdf: "/assets/combo/pdf/drug-combinations-en.pdf",
  });
  expect(chartProps("de").downloads).toBeNull();
  jest
    .mocked(readFileSync)
    .mockReturnValue(
      JSON.stringify({ languages: { en: { digest: "stale" } } }),
    );
  expect(chartProps("en").downloads).toBeNull();
});

it("does not link to missing artifacts", () => {
  jest.mocked(existsSync).mockReturnValue(false);
  expect(chartProps("en").downloads).toBeNull();
  jest.mocked(existsSync).mockReturnValueOnce(true).mockReturnValue(false);
  jest
    .mocked(readFileSync)
    .mockReturnValue(
      JSON.stringify({ languages: { en: { digest: chartSnapshot().digest } } }),
    );
  expect(chartProps("en").downloads).toBeNull();
});
