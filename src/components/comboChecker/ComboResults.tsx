import { useMemo } from "react";
import { accentTone, getCombo, RANK, type RiskKey } from "./comboData";
import ComboCard from "./ComboCard";
import styles from "./comboChecker.module.css";

interface ComboResultsProps {
  selected: string[];
  accent: string;
  showExplanations: boolean;
  sortBySeverity: boolean;
}

interface Card {
  key: string;
  title: string;
  risk: RiskKey;
  note: string;
}

function ComboResults({
  selected,
  accent,
  showExplanations,
  sortBySeverity,
}: ComboResultsProps) {
  const cards = useMemo<Card[]>(() => {
    const out: (Card & { rank: number })[] = [];
    for (let i = 0; i < selected.length; i += 1) {
      for (let j = i + 1; j < selected.length; j += 1) {
        const a = selected[i];
        const b = selected[j];
        const { risk, note } = getCombo(a, b);
        out.push({
          key: `${a}|${b}`,
          title: `${a} + ${b}`,
          risk,
          note,
          rank: RANK[risk],
        });
      }
    }
    if (sortBySeverity) out.sort((x, y) => y.rank - x.rank);
    return out;
  }, [selected, sortBySeverity]);

  if (selected.length < 2) {
    const tone = accentTone(accent);
    const emptyText =
      selected.length === 0
        ? "Select two or more substances above to see how they interact."
        : `Select at least one more substance to compare with ${selected[0]}.`;
    return (
      <div className={styles.empty}>
        <div
          className={styles.emptyIcon}
          style={{ background: tone.container }}
        >
          <svg
            width="34"
            height="24"
            viewBox="0 0 40 28"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="15" cy="14" r="11" stroke={accent} strokeWidth="2.4" />
            <circle cx="25" cy="14" r="11" stroke={accent} strokeWidth="2.4" />
          </svg>
        </div>
        <p className={styles.emptyText}>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {cards.map((c, i) => (
        <ComboCard
          key={c.key}
          title={c.title}
          risk={c.risk}
          note={c.note}
          showNote={showExplanations}
          delay={`${Math.min(i, 8) * 0.035}s`}
        />
      ))}
    </div>
  );
}

export default ComboResults;
