import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/assets/img/logo.png";
import { SUBSTANCES } from "./comboData";
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
}

function ComboChecker({
  accent = "#2487ce",
  showExplanations = true,
  sortBySeverity = true,
}: ComboCheckerProps) {
  const domain = process.env.NEXT_PUBLIC_DNS_DOMAIN || "tripsit.me";
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : prev.concat(name),
    );

  return (
    <div
      className={styles.root}
      style={{ "--cc-accent": accent } as CSSProperties}
    >
      <nav className={styles.nav}>
        <a href={`https://${domain}`} className={styles.brand}>
          <Image
            src={logo}
            alt="TripSit"
            className={styles.brandLogo}
            priority
          />
        </a>
        <div className={styles.navLinks}>
          <a href={`https://${domain}#about`} className={styles.navLink}>
            About
          </a>
          <Link href="/factsheets" className={styles.navLink}>
            Factsheets
          </Link>
          <Link href="/webchat" className={styles.navLink}>
            Chat
          </Link>
          <Link
            href="/combo"
            className={`${styles.navLink} ${styles.navLinkActive}`}
          >
            Tools
          </Link>
        </div>
      </nav>

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

        <div className={styles.disclaimer}>
          This tool, like the combo chart, is a quick-reference guide.{" "}
          <strong>Additional research MUST always be done</strong>. When in
          doubt, don&apos;t mix; start low and go slow.
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image src={logo} alt="TripSit" className={styles.footerLogo} />
          <span className={styles.footerCopy}>
            © Copyright TripSit. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default ComboChecker;
