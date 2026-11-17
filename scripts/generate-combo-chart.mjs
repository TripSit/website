import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/assets/combo");
const languages = (await readdir(path.join(root, "src/assets/comboChart")))
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.slice(0, -5))
  .sort();
const args = process.argv.slice(2);
let baseUrl;
let selected = languages;
for (let i = 0; i < args.length; i += 1) {
  const option = args[i];
  const value = args[++i];
  if (option === "--lang" && languages.includes(value)) selected = [value];
  else if (option === "--base-url" && value) {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("Expected an HTTP(S) base URL.");
    baseUrl = url.origin;
  } else
    throw new Error(
      `Invalid option: ${option} ${value ?? ""}. Use --lang <${languages.join("|")}> or --base-url <url>.`,
    );
}

let server;
let serverError;
let browser;
let interrupted = false;
const staging = await mkdtemp(path.join(tmpdir(), "combogen-"));
function stopServer() {
  if (!server?.pid || server.exitCode !== null) return;
  if (process.platform === "win32") server.kill();
  else process.kill(-server.pid, "SIGTERM");
}
const interrupt = () => {
  interrupted = true;
  stopServer();
};
process.once("SIGINT", interrupt);
process.once("SIGTERM", interrupt);

async function startServer() {
  // Ask the OS for an unused loopback port; never terminate an existing dev server.
  const probe = createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const { port } = probe.address();
  await new Promise((resolve, reject) =>
    probe.close((error) => (error ? reject(error) : resolve())),
  );
  server = spawn(
    process.execPath,
    [
      path.join(root, "node_modules/next/dist/bin/next"),
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
      windowsHide: true,
    },
  );
  server.on("error", (error) => {
    serverError = error;
  });
  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stderr);
  return `http://127.0.0.1:${port}`;
}

async function waitForServer(url) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (interrupted) throw new Error("Chart generation interrupted.");
    if (serverError) throw serverError;
    if (server && server.exitCode !== null)
      throw new Error(
        `Next.js exited (${server.exitCode}). Stop your dev server or pass --base-url to reuse it.`,
      );
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      await response.arrayBuffer();
      if (response.ok) return;
    } catch {
      /* The server may still be starting. */
    }
    await delay(500);
  }
  throw new Error(`Chart server did not become ready: ${url}`);
}

try {
  baseUrl ??= await startServer();
  await waitForServer(`${baseUrl}/combo/chart`);
  browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 4000, height: 2200, deviceScaleFactor: 1 });
  // Exports rely only on local fonts/assets. Fail if a page unexpectedly depends on a remote resource.
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (url.startsWith(`${baseUrl}/`) || url.startsWith("data:"))
      void request.continue();
    else void request.abort();
  });
  let manifest = { version: 1, languages: {} };
  try {
    manifest = JSON.parse(
      await readFile(path.join(output, "manifest.json"), "utf8"),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  for (const language of selected) {
    if (interrupted) throw new Error("Chart generation interrupted.");
    const route =
      language === "en" ? "/combo/chart" : `/combo/chart/${language}`;
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle0",
      timeout: 120_000,
    });
    if (!response?.ok()) throw new Error(`Chart request failed: ${route}`);
    await page.addStyleTag({
      content:
        "nextjs-portal { display: none !important; } [data-combo-chart] { zoom: 1 !important; }",
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((image) => image.decode()),
      );
    });
    const poster = await page.$("[data-combo-chart]");
    if (!poster) throw new Error(`No chart found for ${language}.`);
    const info = await poster.evaluate((element) => {
      // Round up before capture so PNG clipping and PDF pagination use the same integer box.
      element.style.height = `${Math.ceil(element.getBoundingClientRect().height) + 2}px`;
      return {
        language: element.dataset.language,
        digest: element.dataset.digest,
        pairs: Number(element.dataset.pairs),
        unknown: Number(element.dataset.unknown),
        conflicts: Number(element.dataset.conflicts),
        license: element.dataset.license,
        width: element.offsetWidth,
        height: element.offsetHeight,
        clipped: Array.from(
          element.querySelectorAll("th, td, h1, footer p, footer li"),
        ).some(
          (node) =>
            node.scrollWidth > node.clientWidth + 1 ||
            node.scrollHeight > node.clientHeight + 1,
        ),
      };
    });
    if (
      info.language !== language ||
      !/^[a-f0-9]{64}$/.test(info.digest) ||
      info.pairs !== 300 ||
      info.unknown ||
      info.conflicts ||
      info.clipped
    ) {
      throw new Error(`Chart validation failed: ${JSON.stringify(info)}`);
    }
    const basename = `drug-combinations-${language}`;
    const pngPath = path.join(staging, `${basename}.png`);
    const pdfPath = path.join(staging, `${basename}.pdf`);
    await poster.screenshot({ path: pngPath });
    // Print only the poster at its measured size. No first-page filter can hide overflow.
    await page.addStyleTag({
      content: `@media print { html, body, #__next { margin: 0 !important; padding: 0 !important; } [data-combo-chart] { width: ${info.width}px !important; } }`,
    });
    await page.pdf({
      path: pdfPath,
      width: `${info.width}px`,
      height: `${info.height}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      waitForFonts: true,
    });
    const png = await readFile(pngPath);
    const pdf = await PDFDocument.load(await readFile(pdfPath));
    if (!info.license?.includes("PolyForm Noncommercial 1.0.0"))
      throw new Error(`Missing license for ${language}.`);
    pdf.setAuthor("TripSit");
    pdf.setSubject(info.license);
    await writeFile(pdfPath, await pdf.save());
    if (
      png.readUInt32BE(16) !== info.width ||
      png.readUInt32BE(20) !== info.height ||
      pdf.getPageCount() !== 1
    ) {
      throw new Error(
        `Invalid export for ${language}: PNG ${png.readUInt32BE(16)}×${png.readUInt32BE(20)}, expected ${info.width}×${info.height}; PDF pages ${pdf.getPageCount()}.`,
      );
    }
    const size = pdf.getPage(0).getSize();
    if (
      Math.abs(size.width - info.width * 0.75) > 1 ||
      Math.abs(size.height - info.height * 0.75) > 1
    ) {
      throw new Error(`Invalid PDF dimensions for ${language}.`);
    }
    manifest.languages[language] = {
      digest: info.digest,
      width: info.width,
      height: info.height,
    };
    console.log(
      `Validated ${language}: ${info.pairs} pairs, PNG ${info.width}×${info.height}, one-page PDF.`,
    );
  }

  // Publish only after every selected language passed validation.
  for (const format of ["png", "pdf"]) {
    await mkdir(path.join(output, format), { recursive: true });
    for (const language of selected) {
      const filename = `drug-combinations-${language}.${format}`;
      await copyFile(
        path.join(staging, filename),
        path.join(output, format, filename),
      );
    }
  }
  await writeFile(
    path.join(output, "manifest.json.tmp"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await rename(
    path.join(output, "manifest.json.tmp"),
    path.join(output, "manifest.json"),
  );
  console.log(`Saved chart downloads to ${output}`);
} finally {
  await browser?.close();
  stopServer();
  await rm(staging, { recursive: true, force: true });
  process.removeListener("SIGINT", interrupt);
  process.removeListener("SIGTERM", interrupt);
}
