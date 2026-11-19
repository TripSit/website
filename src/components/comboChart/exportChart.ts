import {
  GROUPS,
  LEGEND_ORDER,
  RISK,
  getCombo,
} from "../comboChecker/comboData";
import {
  drugLabel,
  riskLabel,
  TRANSLATIONS,
  type ChartLanguage,
} from "./translations";
import {
  CHART_COLORS,
  GROUP_COLORS,
  LICENSE_NOTICE,
  LICENSE_URL,
  exportError,
  orderedSubstances,
  posterWidth,
} from "./chartModel";

export interface ExportOptions {
  selected: readonly string[];
  language: ChartLanguage;
  width: number;
  height: number;
}

// Wrap at words, splitting long labels only when necessary. Layout is measured before drawing.
export function wrapText(
  text: string,
  width: number,
  measure: (text: string) => number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && measure(`${line} ${word}`) <= width) {
      line += ` ${word}`;
      continue;
    }
    if (line) {
      lines.push(line);
      line = "";
    }
    for (const character of word) {
      if (line && measure(line + character) > width) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

type TextBox = { lines: string[]; size: number; height: number };
const BACKGROUND = "#07090c";

export async function renderChartCanvas(
  options: ExportOptions,
): Promise<HTMLCanvasElement> {
  const error = exportError(options.selected, options.width, options.height);
  if (error) throw new Error(error);
  const substances = orderedSubstances(options.selected);
  const translation = TRANSLATIONS[options.language];
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error(
      "Your browser could not create an image. Try smaller dimensions.",
    );
  const ctx = context;
  const width = posterWidth(substances.length);
  const margin = 64;
  const inner = width - margin * 2;
  const rowLabelWidth = 190;
  const cellWidth = (inner - rowLabelWidth) / substances.length;
  function box(
    text: string,
    maxWidth: number,
    size: number,
    bold = false,
  ): TextBox {
    ctx.font = `${bold ? "bold " : ""}${size}px Arial, sans-serif`;
    const lines = wrapText(
      text,
      maxWidth,
      (value) => ctx.measureText(value).width,
    );
    return { lines, size, height: lines.length * size * 1.35 };
  }
  const title = box(translation.title, inner - 380, 64, true);
  const headerHeight = Math.max(150, title.height + 40);
  const labels = substances.map((name) =>
    box(
      drugLabel(translation, name),
      Math.min(cellWidth, rowLabelWidth) - 16,
      20,
      true,
    ),
  );
  const columnHeight = Math.max(84, ...labels.map((item) => item.height + 20));
  const rowHeight = Math.max(44, ...labels.map((item) => item.height + 12));
  const tableY = margin + headerHeight;
  const footerY = tableY + columnHeight + rowHeight * substances.length + 36;
  const disclaimerWidth = inner * 0.54;
  const paragraphs = translation.disclaimer.map((text, i) =>
    box(text, disclaimerWidth, i === 0 ? 28 : 25, i === 0),
  );
  const disclaimerHeight = paragraphs.reduce(
    (sum, item) => sum + item.height + 16,
    0,
  );
  const legendWidth = inner - disclaimerWidth - 60;
  const legend = LEGEND_ORDER.map((risk) => ({
    risk,
    text: box(riskLabel(translation, risk), legendWidth - 70, 25),
  }));
  const legendHeight = legend.reduce(
    (sum, item) => sum + Math.max(40, item.text.height) + 12,
    0,
  );
  const notice = box(`${LICENSE_NOTICE} ${LICENSE_URL}`, inner, 22);
  const noticeY = footerY + Math.max(disclaimerHeight, legendHeight) + 36;
  const height = noticeY + notice.height + margin;
  const scale = Math.min(options.width / width, options.height / height);
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, options.width, options.height);
  ctx.translate(
    (options.width - width * scale) / 2,
    (options.height - height * scale) / 2,
  );
  ctx.scale(scale, scale);
  ctx.textBaseline = "top";
  function text(
    item: TextBox,
    x: number,
    y: number,
    bold = false,
    align: CanvasTextAlign = "left",
    color = "#fff",
  ) {
    ctx.font = `${bold ? "bold " : ""}${item.size}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    for (const [i, line] of item.lines.entries()) {
      ctx.fillText(line, x, y + i * item.size * 1.35);
    }
  }
  const image = new Image();
  image.src = "/assets/img/logo.png";
  await image.decode();
  ctx.drawImage(
    image,
    margin,
    margin,
    300,
    (300 * image.naturalHeight) / image.naturalWidth,
  );
  text(title, width - margin, margin, true, "right");
  function cell(
    x: number,
    y: number,
    w: number,
    h: number,
    background: string,
  ) {
    ctx.fillStyle = background;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  }
  function groupColor(name: string) {
    return GROUP_COLORS[
      GROUPS.findIndex((group) => group.substances.includes(name))
    ];
  }
  for (const [i, a] of substances.entries()) {
    const x = margin + rowLabelWidth + i * cellWidth;
    const y = tableY + columnHeight + i * rowHeight;
    cell(x, tableY, cellWidth, columnHeight, groupColor(a));
    text(
      labels[i],
      x + cellWidth / 2,
      tableY + (columnHeight - labels[i].height) / 2,
      true,
      "center",
    );
    cell(margin, y, rowLabelWidth, rowHeight, groupColor(a));
    text(
      labels[i],
      margin + rowLabelWidth / 2,
      y + (rowHeight - labels[i].height) / 2,
      true,
      "center",
    );
    for (const [j, b] of substances.entries()) {
      const cellX = margin + rowLabelWidth + j * cellWidth;
      if (a === b) {
        cell(cellX, y, cellWidth, rowHeight, groupColor(a));
        text(
          labels[i],
          cellX + cellWidth / 2,
          y + (rowHeight - labels[i].height) / 2,
          true,
          "center",
        );
      } else {
        const { risk } = getCombo(a, b);
        cell(cellX, y, cellWidth, rowHeight, CHART_COLORS[risk]);
        text(
          { lines: [RISK[risk].glyph], size: 28, height: 38 },
          cellX + cellWidth / 2,
          y + (rowHeight - 30) / 2,
          true,
          "center",
          "#080c10",
        );
      }
    }
  }
  let paragraphY = footerY;
  for (const [i, item] of paragraphs.entries()) {
    text(item, margin, paragraphY, i === 0);
    paragraphY += item.height + 16;
  }
  let legendY = footerY;
  for (const { risk, text: item } of legend) {
    cell(margin + disclaimerWidth + 60, legendY, 44, 40, CHART_COLORS[risk]);
    text(
      { lines: [RISK[risk].glyph], size: 28, height: 38 },
      margin + disclaimerWidth + 82,
      legendY + 4,
      true,
      "center",
      "#080c10",
    );
    text(item, margin + disclaimerWidth + 118, legendY + 3);
    legendY += Math.max(40, item.height) + 12;
  }
  text(notice, margin, noticeY, false, "left", "#c8d2dc");
  return canvas;
}

export function canvasPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error("Could not encode the image. Try smaller dimensions."),
            ),
      "image/png",
    ),
  );
}

export async function chartPdf(
  png: Uint8Array,
  width: number,
  height: number,
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setTitle("TripSit drug combination chart");
  pdf.setAuthor("TripSit");
  pdf.setSubject(`${LICENSE_NOTICE} ${LICENSE_URL}`);
  const page = pdf.addPage([width * 0.75, height * 0.75]);
  const image = await pdf.embedPng(png);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });
  return pdf.save();
}

export async function downloadChart(
  options: ExportOptions,
  format: "png" | "pdf",
) {
  const canvas = await renderChartCanvas(options);
  const png = await canvasPng(canvas);
  canvas.width = 1;
  canvas.height = 1;
  const blob =
    format === "png"
      ? png
      : new Blob(
          [
            new Uint8Array(
              await chartPdf(
                new Uint8Array(await png.arrayBuffer()),
                options.width,
                options.height,
              ),
            ),
          ],
          { type: "application/pdf" },
        );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `drug-combinations-${options.language}-${options.width}x${options.height}.${format}`;
  document.body.append(link);
  link.click();
  link.remove();
  // Allow browsers time to consume the download before releasing its backing storage.
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
