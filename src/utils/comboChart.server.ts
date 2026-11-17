import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  LICENSE_NOTICE,
  LICENSE_URL,
} from "../components/comboChart/chartModel";
import {
  GROUPS,
  SUBSTANCES,
  getCombo,
} from "../components/comboChecker/comboData";
import {
  TRANSLATIONS,
  type ChartLanguage,
} from "../components/comboChart/translations";

export interface ChartDownloads {
  png: string;
  pdf: string;
}
export interface ChartProps {
  language: ChartLanguage;
  digest: string;
  downloads: ChartDownloads | null;
  audit: { pairs: number; unknown: number; conflicts: number };
}

// Includes both directions: a conflicting database update must not produce a misleading chart.
export function chartSnapshot() {
  const pairs = SUBSTANCES.flatMap((a, index) =>
    SUBSTANCES.slice(index + 1).map((b) => ({
      a,
      b,
      forward: getCombo(a, b),
      reverse: getCombo(b, a),
    })),
  );
  return {
    digest: createHash("sha256")
      .update(
        JSON.stringify({
          groups: GROUPS,
          pairs,
          translations: TRANSLATIONS,
          license: { notice: LICENSE_NOTICE, url: LICENSE_URL },
        }),
      )
      .digest("hex"),
    audit: {
      pairs: pairs.length,
      unknown: pairs.filter(
        ({ forward, reverse }) =>
          forward.risk === "unknown" || reverse.risk === "unknown",
      ).length,
      conflicts: pairs.filter(
        ({ forward, reverse }) => forward.risk !== reverse.risk,
      ).length,
    },
  };
}

export function chartProps(language: ChartLanguage): ChartProps {
  const { digest, audit } = chartSnapshot();
  let downloads: ChartDownloads | null = null;
  const root = path.join(process.cwd(), "public/assets/combo");
  const manifestPath = path.join(root, "manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const entry = manifest.languages?.[language];
    const basename = `drug-combinations-${language}`;
    // A changed dataset/translation hides stale downloads until they are regenerated.
    if (
      entry?.digest === digest &&
      existsSync(path.join(root, "png", `${basename}.png`)) &&
      existsSync(path.join(root, "pdf", `${basename}.pdf`))
    ) {
      downloads = {
        png: `/assets/combo/png/${basename}.png`,
        pdf: `/assets/combo/pdf/${basename}.pdf`,
      };
    }
  }
  return { language, digest, downloads, audit };
}
