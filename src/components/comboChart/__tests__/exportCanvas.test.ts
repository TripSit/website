import { getCombo, RISK } from "../../comboChecker/comboData";
import { LICENSE_NOTICE } from "../chartModel";
import { canvasPng, downloadChart, renderChartCanvas } from "../exportChart";
import { TRANSLATIONS } from "../translations";

// jsdom has no 2D canvas, image decoding, font loading or blob URLs, so each is replaced by a
// small fake that records what the export code asks for.
const pngBytes = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jOmkAAAAASUVORK5CYII=",
    "base64",
  ),
);

function fakeContext() {
  return {
    font: "",
    fillStyle: "",
    textAlign: "left",
    textBaseline: "alphabetic",
    measureText: jest.fn((text: string) => ({ width: text.length * 10 })),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    drawImage: jest.fn(),
  };
}

type FakeContext = ReturnType<typeof fakeContext>;
let context: FakeContext | null;
let encoded: unknown;
let canvas: { width: number; height: number };
const originalImage = globalThis.Image;
const createElement = document.createElement.bind(document);

class FakeImage {
  src = "";
  naturalWidth = 600;
  naturalHeight = 200;
  decode() {
    return Promise.resolve();
  }
}

beforeEach(() => {
  context = fakeContext();
  encoded = { arrayBuffer: async () => pngBytes.buffer };
  jest.spyOn(document, "createElement").mockImplementation(((tag: string) => {
    if (tag !== "canvas") return createElement(tag);
    canvas = {
      width: 0,
      height: 0,
      getContext: () => context,
      toBlob: (done: (blob: unknown) => void) => done(encoded),
    } as unknown as HTMLCanvasElement;
    return canvas;
  }) as typeof document.createElement);
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
  globalThis.Image = FakeImage as unknown as typeof Image;
  URL.createObjectURL = jest.fn(() => "blob:chart");
  URL.revokeObjectURL = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
  globalThis.Image = originalImage;
});

const options = {
  selected: ["LSD", "Alcohol"],
  language: "en" as const,
  width: 1200,
  height: 800,
};

function drawnText(ctx: FakeContext) {
  return ctx.fillText.mock.calls.map(([text]) => text as string);
}

it("draws the logo, title, both labels, the pair's risk, the legend and the license", async () => {
  const result = await renderChartCanvas(options);
  const ctx = context as FakeContext;
  expect(result).toBe(canvas);
  expect(canvas).toMatchObject({ width: 1200, height: 800 });
  expect(ctx.drawImage).toHaveBeenCalledWith(
    expect.objectContaining({ src: "/assets/img/logo.png" }),
    64,
    64,
    300,
    100,
  );
  const text = drawnText(ctx);
  const title = TRANSLATIONS.en.title;
  expect(text.join(" ")).toContain(title.split(" ")[0]);
  expect(text).toEqual(expect.arrayContaining(["LSD", "Alcohol"]));
  expect(text).toContain(RISK[getCombo("LSD", "Alcohol").risk].glyph);
  expect(text.join(" ")).toContain(LICENSE_NOTICE.split(" ")[0]);
  // Scaled to fit the requested size, centred, on the dark background.
  expect(ctx.fillRect).toHaveBeenNthCalledWith(1, 0, 0, 1200, 800);
  expect(ctx.scale).toHaveBeenCalledTimes(1);
});

it("refuses an invalid selection before drawing", async () => {
  await expect(
    renderChartCanvas({ ...options, selected: ["LSD"] }),
  ).rejects.toThrow(/two substances/);
  expect(document.createElement).not.toHaveBeenCalledWith("canvas");
});

it("explains when the browser cannot create a canvas", async () => {
  context = null;
  await expect(renderChartCanvas(options)).rejects.toThrow(
    "Your browser could not create an image. Try smaller dimensions.",
  );
});

it("encodes the canvas as a PNG, or explains why it could not", async () => {
  const target = document.createElement("canvas");
  await expect(canvasPng(target)).resolves.toBe(encoded);
  encoded = null;
  await expect(canvasPng(target)).rejects.toThrow(
    "Could not encode the image. Try smaller dimensions.",
  );
});

describe("downloadChart", () => {
  let clicked: HTMLAnchorElement[];

  beforeEach(() => {
    clicked = [];
    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        clicked.push(this);
      });
    jest.spyOn(globalThis, "setTimeout");
  });

  it("downloads a PNG, frees the canvas, and releases the URL later", async () => {
    await downloadChart(options, "png");
    expect(URL.createObjectURL).toHaveBeenCalledWith(encoded);
    expect(clicked).toHaveLength(1);
    expect(clicked[0].download).toBe("drug-combinations-en-1200x800.png");
    expect(clicked[0].href).toBe("blob:chart");
    expect(clicked[0].isConnected).toBe(false);
    expect(canvas).toMatchObject({ width: 1, height: 1 });
    const [release, delay] = jest.mocked(setTimeout).mock.calls[0];
    expect(delay).toBe(60_000);
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    (release as () => void)();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:chart");
  });

  it("wraps the PNG in a PDF when asked", async () => {
    await downloadChart({ ...options, language: "de" }, "pdf");
    const blob = jest.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(pngBytes.length);
    expect(clicked[0].download).toBe("drug-combinations-de-1200x800.pdf");
  });
});
