import { LEGEND_ORDER, RISK } from "./comboData";
import styles from "./comboChecker.module.css";

function Legend() {
  return (
    <div className={styles.legend}>
      {LEGEND_ORDER.map((key) => {
        const r = RISK[key];
        return (
          <span
            key={key}
            className={styles.legendItem}
            style={{ background: r.cBg, color: r.cText }}
          >
            <span
              className={styles.legendBadge}
              style={{ background: r.badge }}
            >
              {r.glyph}
            </span>
            {r.label}
          </span>
        );
      })}
    </div>
  );
}

export default Legend;
