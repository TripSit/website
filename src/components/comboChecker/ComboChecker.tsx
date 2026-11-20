import { useState } from "react";
import Link from "next/link";
import { SUBSTANCES } from "./comboData";
import { suggestChangeUrl } from "./comboLinks";
import ComboFrame from "./ComboFrame";
import Legend from "./Legend";
import SubstanceSelector from "./SubstanceSelector";
import ComboResults from "./ComboResults";
import styles from "./comboChecker.module.css";

interface ComboCheckerProps {
  /** Accent color. Design options: #2487ce, #683394, #47aeff, #11dbcf. */
  accent?: string;
  /** Show the explanation note on each result card. */
  showExplanations?: boolean;
  /** Sort result cards by severity (most dangerous first). */
  sortBySeverity?: boolean;
  /** Other names for each substance, listed under the results for the selected ones. */
  nicknames?: Record<string, string[]>;
}

function ComboChecker({
  accent = "#2487ce",
  showExplanations = true,
  sortBySeverity = true,
  nicknames = {},
}: Readonly<ComboCheckerProps>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  return (
    <ComboFrame accent={accent}>
      <main className={styles.main}>
        <header>
          <h1 className={`${styles.title} ${styles.disp}`}>
            Drug Combinations
          </h1>
          <p className={styles.subtitle}>
            Check how two or more substances interact before you mix. Pick
            substances below. This is a quick-reference guide, not medical
            advice.
          </p>
          <p>
            <Link href="/combo/chart">
              View the full chart and PNG/PDF downloads →
            </Link>
          </p>
        </header>

        <Legend />

        <SubstanceSelector
          substances={SUBSTANCES}
          selected={selected}
          query={query}
          onToggle={toggle}
          onQuery={setQuery}
          onClearAll={() => setSelected([])}
        />

        <p
          className={`${styles.sectionLabel} ${styles.sectionLabelResults} ${styles.disp}`}
        >
          Combinations
        </p>
        <ComboResults
          selected={selected}
          accent={accent}
          showExplanations={showExplanations}
          sortBySeverity={sortBySeverity}
        />

        {selected.some((name) => nicknames[name]) && (
          <section className={styles.nicknames} aria-label="Also known as">
            <p className={`${styles.nicknamesTitle} ${styles.disp}`}>
              Also known as
            </p>
            <dl className={styles.nicknamesList}>
              {selected
                .filter((name) => nicknames[name])
                .map((name) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{nicknames[name].join(", ")}</dd>
                  </div>
                ))}
            </dl>
          </section>
        )}

        <div className={styles.disclaimer}>
          This tool, like the combo chart, is a quick-reference guide.{" "}
          <strong>Additional research MUST always be done</strong>. When in
          doubt, don&apos;t mix; start low and go slow.
          <p>
            <a href="https://wiki.tripsit.me/wiki/Drug_combinations#Use_&_Attribution">
              Re-use and attribution information
            </a>
          </p>
          <p>
            Notice incorrect combo data?{" "}
            <a href={suggestChangeUrl()}>Suggest a correction</a> to our drug
            team, with a source.
          </p>
        </div>
      </main>
    </ComboFrame>
  );
}

export default ComboChecker;
