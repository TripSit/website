import Link from "next/link";
import { RISK, type RiskKey } from "./comboData";
import styles from "./comboChecker.module.css";

interface ComboCardProps {
  title: string;
  risk: RiskKey;
  note: string;
  showNote: boolean;
  delay: string;
  /** The pair's own page, with its sources and how to suggest a change. */
  href?: string;
  sourceCount?: number;
}

function detailsLabel(sourceCount: number): string {
  if (sourceCount === 0) return "Details";
  return `Details and ${sourceCount} ${sourceCount === 1 ? "source" : "sources"}`;
}

function ComboCard({
  title,
  risk,
  note,
  showNote,
  delay,
  href,
  sourceCount = 0,
}: Readonly<ComboCardProps>) {
  const r = RISK[risk];
  return (
    <div className={styles.card} style={{ animationDelay: delay }}>
      <div className={styles.cardHead}>
        <span className={styles.cardBadge} style={{ background: r.badge }}>
          {r.glyph}
        </span>
        <div className={styles.cardTitleWrap}>
          <div className={`${styles.cardTitle} ${styles.disp}`}>{title}</div>
          <div
            className={`${styles.cardLabel} ${styles.mono}`}
            style={{ color: r.badge }}
          >
            {r.label}
          </div>
        </div>
      </div>
      {showNote && note && <p className={styles.cardNote}>{note}</p>}
      {showNote && !note && (
        <p className={`${styles.cardNote} ${styles.cardNoteMissing}`}>
          No explanation has been written for this combination yet.
        </p>
      )}
      {href && (
        <Link href={href} className={styles.cardLink}>
          {detailsLabel(sourceCount)}
          <span className="sr-only"> for {title}</span>
          <span aria-hidden="true"> →</span>
        </Link>
      )}
    </div>
  );
}

export default ComboCard;
