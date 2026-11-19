import Image from "next/image";
import Link from "next/link";
import NextHead from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Head from "../Head";
import logo from "../../../public/assets/img/logo.png";
import {
  GROUPS,
  SUBSTANCES,
  RISK,
  LEGEND_ORDER,
  getCombo,
} from "../comboChecker/comboData";
import {
  chartDescription,
  LANGUAGES,
  TRANSLATIONS,
  chartPath,
  drugLabel,
  riskLabel,
  isChartLanguage,
} from "./translations";
import type { ChartProps } from "../../utils/comboChart.server";
import { siteOrigin } from "../../utils/siteOrigin";
import styles from "./comboChart.module.css";
import {
  CHART_COLORS,
  GROUP_COLORS,
  LICENSE_NAME,
  LICENSE_NOTICE,
  LICENSE_URL,
  exportError,
  posterWidth,
} from "./chartModel";

function printChart() {
  const poster = document.querySelector<HTMLElement>("[data-combo-chart]");
  if (!poster) return;
  const style = document.createElement("style");
  style.textContent = `@page { size: ${poster.offsetWidth}px ${poster.offsetHeight + 2}px; margin: 0; }`;
  document.head.append(style);
  try {
    globalThis.print();
  } finally {
    style.remove();
  }
}

export default function ComboChart({
  language,
  digest,
  downloads,
  audit,
}: Readonly<ChartProps>) {
  const router = useRouter();
  const viewport = useRef<HTMLElement>(null);
  const [fit, setFit] = useState(true);
  const [availableWidth, setAvailableWidth] = useState(3910);
  const [selected, setSelected] = useState<string[]>(SUBSTANCES);
  const [width, setWidth] = useState("3910");
  const [height, setHeight] = useState("2000");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const substances = SUBSTANCES.filter((name) => selected.includes(name));
  const naturalWidth = posterWidth(substances.length);
  const validation = exportError(substances, Number(width), Number(height));
  function toggleSubstance(name: string) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((value) => value !== name)
        : [...current, name],
    );
  }
  async function generate(format: "png" | "pdf") {
    if (busy || validation) return;
    setBusy(true);
    setMessage(`Generating ${format.toUpperCase()}…`);
    try {
      const { downloadChart } = await import("./exportChart");
      await downloadChart(
        {
          selected: substances,
          language,
          width: Number(width),
          height: Number(height),
        },
        format,
      );
      setMessage(`${format.toUpperCase()} ready. Your download has started.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not generate the chart. Please try smaller dimensions.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!viewport.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setAvailableWidth(entry.contentRect.width),
    );
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  const translation = TRANSLATIONS[language];
  const groupColor = (substance: string) =>
    GROUP_COLORS[GROUPS.findIndex((g) => g.substances.includes(substance))];
  const label = (substance: string) => drugLabel(translation, substance);

  return (
    <div className={styles.page}>
      <Head
        title={`${translation.title} - TripSit`}
        path={chartPath(language)}
        description={chartDescription(language)}
        image="/assets/img/comboChart.png"
        imageAlt="TripSit drug combination chart"
      />
      <NextHead>
        {Object.keys(LANGUAGES)
          .filter((lang) => isChartLanguage(lang))
          .map((lang) => (
            <link
              key={lang}
              rel="alternate"
              hrefLang={lang}
              href={`${siteOrigin}${chartPath(lang)}`}
            />
          ))}
      </NextHead>
      <nav className={styles.toolbar} aria-label="Chart controls">
        <Link href="/combo">← Combination checker</Link>
        <label>
          <span>Language / Sprache / Idioma</span>
          <select
            value={language}
            onChange={(event) => {
              const lang = event.target.value;
              if (isChartLanguage(lang)) void router.push(chartPath(lang));
            }}
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.actions}>
          <button type="button" onClick={() => setFit((value) => !value)}>
            {fit ? "Actual size" : "Fit to width"}
          </button>
          {downloads && (
            <>
              <a href={downloads.png} download>
                Full chart PNG ↓
              </a>
              <a href={downloads.pdf} download>
                Full chart PDF ↓
              </a>
            </>
          )}
          <button
            type="button"
            onClick={printChart}
            disabled={substances.length < 2}
          >
            Print
          </button>
        </div>
      </nav>
      <section className={styles.builder} aria-label="Customize chart">
        <h2>Build your chart</h2>
        <p>
          Choose substances and download a chart at your own dimensions. The
          chart keeps its proportions and fits inside the image, with space
          around it when needed.
        </p>
        <details>
          <summary>
            Substances ({substances.length} of {SUBSTANCES.length} selected)
          </summary>
          <div className={styles.selectionActions}>
            <button type="button" onClick={() => setSelected(SUBSTANCES)}>
              Select all
            </button>
            <button type="button" onClick={() => setSelected([])}>
              Clear selection
            </button>
          </div>
          <div className={styles.groups}>
            {GROUPS.map((group) => (
              <fieldset key={group.name}>
                <legend>{group.name}</legend>
                {group.substances.map((name) => (
                  <label key={name}>
                    <input
                      type="checkbox"
                      checked={selected.includes(name)}
                      onChange={() => toggleSubstance(name)}
                    />
                    {label(name)}
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
        </details>
        <div className={styles.exportControls}>
          <label>
            <span>Width (pixels)</span>
            <input
              type="number"
              min="320"
              max="8192"
              step="1"
              value={width}
              onChange={(event) => setWidth(event.target.value)}
            />
          </label>
          <label>
            <span>Height (pixels)</span>
            <input
              type="number"
              min="320"
              max="8192"
              step="1"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy || !!validation}
            onClick={() => void generate("png")}
          >
            Generate PNG
          </button>
          <button
            type="button"
            disabled={busy || !!validation}
            onClick={() => void generate("pdf")}
          >
            Generate PDF
          </button>
        </div>
        <p className={styles.hint}>
          320–8192 pixels per side, up to 32 million pixels total. PDF pages use
          96 pixels per inch. Small images may need zooming to read.
        </p>
        {validation && <p role="alert">{validation}</p>}
        <output aria-live="polite">{message}</output>
        <p>
          {LICENSE_NOTICE}{" "}
          <a href={LICENSE_URL}>{LICENSE_NAME} license terms</a>
        </p>
      </section>
      <main
        ref={viewport}
        lang={language}
        className={styles.scroll}
        aria-label={translation.title}
        // The poster is wider than most screens: focus lets keyboard users scroll it.
        tabIndex={0} // NOSONAR: a scrollable region must be focusable (WCAG 2.1.1)
      >
        <article
          className={styles.poster}
          hidden={substances.length < 2}
          style={{
            width: naturalWidth,
            zoom: fit ? Math.min(1, availableWidth / naturalWidth) : 1,
          }}
          data-combo-chart
          data-language={language}
          data-digest={digest}
          data-pairs={audit.pairs}
          data-unknown={audit.unknown}
          data-conflicts={audit.conflicts}
          data-license={`${LICENSE_NOTICE} ${LICENSE_URL}`}
        >
          <header className={styles.heading}>
            <Link href="/" aria-label="TripSit home">
              <Image
                src={logo}
                alt="TripSit"
                priority
                className={styles.logo}
              />
            </Link>
            <h1>{translation.title}</h1>
          </header>
          <table className={styles.matrix}>
            <caption className={styles.srOnly}>{translation.title}</caption>
            <thead>
              <tr>
                <td />
                {substances.map((substance) => (
                  <th
                    scope="col"
                    key={substance}
                    style={{ background: groupColor(substance) }}
                  >
                    {label(substance)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {substances.map((a) => (
                <tr key={a}>
                  <th scope="row" style={{ background: groupColor(a) }}>
                    {label(a)}
                  </th>
                  {substances.map((b) => {
                    if (a === b)
                      return (
                        <td
                          key={b}
                          className={styles.diagonal}
                          style={{ background: groupColor(a) }}
                        >
                          <span aria-hidden="true">{label(a)}</span>
                          <span className={styles.srOnly}>—</span>
                        </td>
                      );
                    const { risk, note } = getCombo(a, b);
                    const description = `${label(a)} + ${label(b)}: ${riskLabel(translation, risk)}`;
                    return (
                      <td
                        key={b}
                        style={{ background: CHART_COLORS[risk] }}
                        data-risk={risk}
                        data-pair={`${a}|${b}`}
                      >
                        <span
                          aria-hidden="true"
                          title={
                            note ? [description, note].join(" — ") : description
                          }
                          className={styles.glyph}
                        >
                          {RISK[risk].glyph}
                        </span>
                        <span className={styles.srOnly}>{description}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <footer className={styles.footer}>
            <section className={styles.disclaimer} aria-label="Disclaimer">
              {translation.disclaimer.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? styles.lead : undefined}
                >
                  {paragraph}
                </p>
              ))}
              <a href="https://tripsit.me">{translation.app}</a>
              <span className={styles.separator}> · </span>
              <a href="https://www.patreon.com/bePatron?u=899550">
                {translation.support}
              </a>
            </section>
            <ul className={styles.legend} aria-label="Legend">
              {LEGEND_ORDER.map((risk) => (
                <li key={risk}>
                  <span
                    aria-hidden="true"
                    className={styles.legendGlyph}
                    style={{ background: CHART_COLORS[risk] }}
                  >
                    {RISK[risk].glyph}
                  </span>
                  <span>{riskLabel(translation, risk)}</span>
                </li>
              ))}
            </ul>
          </footer>
          <p className={styles.source}>
            TripSit · tripsit.me/combo/chart · {digest.slice(0, 12)}
          </p>
          <p className={styles.license}>
            {LICENSE_NOTICE} <a href={LICENSE_URL}>{LICENSE_URL}</a>
          </p>
        </article>
      </main>
    </div>
  );
}
