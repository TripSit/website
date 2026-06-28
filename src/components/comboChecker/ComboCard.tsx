import { RISK, type RiskKey } from "./comboData";
import styles from "./comboChecker.module.css";

interface ComboCardProps {
  title: string;
  risk: RiskKey;
  note: string;
  showNote: boolean;
  delay: string;
}

function ComboCard({ title, risk, note, showNote, delay }: ComboCardProps) {
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
    </div>
  );
}

export default ComboCard;
