/** @jest-environment node */
import { PDFDocument } from "pdf-lib";
import {
  exportError,
  orderedSubstances,
  LICENSE_NOTICE,
  LICENSE_URL,
} from "../chartModel";
import { chartPdf, wrapText } from "../exportChart";

it("keeps chart order, removes duplicates, and excludes unsupported substances", () => {
  expect(orderedSubstances(["Alcohol", "LSD", "LSD", "unknown"])).toEqual([
    "LSD",
    "Alcohol",
  ]);
});

it.each([
  [[], 1200, 800, /two substances/],
  [["LSD", "LSD"], 1200, 800, /two substances/],
  [["LSD", "Alcohol"], 319, 800, /whole numbers/],
  [["LSD", "Alcohol"], 1200, 8193, /whole numbers/],
  [["LSD", "Alcohol"], 1200.5, 800, /whole numbers/],
  [["LSD", "Alcohol"], Number.NaN, 800, /whole numbers/],
  [["LSD", "Alcohol"], 8192, 8192, /32 million/],
] as const)(
  "rejects invalid selection or dimensions (%j, %s × %s)",
  (selected, width, height, message) => {
    expect(exportError(selected, width, height)).toMatch(message);
  },
);

it("accepts bounded portrait, landscape, and square exports", () => {
  [
    [320, 320],
    [8192, 320],
    [1200, 2400],
    [4000, 4000],
  ].forEach(([w, h]) =>
    expect(exportError(["LSD", "Alcohol"], w, h)).toBeNull(),
  );
});

it("wraps long translated words and preserves every character", () => {
  const measure = (text: string) => text.length;
  const lines = wrapText("Psilocybinové houby Benzodiazepiny", 8, measure);
  expect(lines.every((line) => line.length <= 8)).toBe(true);
  expect(lines.join("").replaceAll(" ", "")).toBe(
    "PsilocybinovéhoubyBenzodiazepiny",
  );
  expect(wrapText("", 8, measure)).toEqual([]);
});

it("creates one PDF page at the requested size with the license metadata", async () => {
  const png = new Uint8Array(
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jOmkAAAAASUVORK5CYII=",
      "base64",
    ),
  );
  const bytes = await chartPdf(png, 1600, 900);
  const document = await PDFDocument.load(bytes);
  expect(document.getPageCount()).toBe(1);
  expect(document.getPage(0).getSize()).toEqual({ width: 1200, height: 675 });
  expect(document.getSubject()).toBe(`${LICENSE_NOTICE} ${LICENSE_URL}`);
});
