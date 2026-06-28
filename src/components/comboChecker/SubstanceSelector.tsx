import styles from "./comboChecker.module.css";

interface SubstanceSelectorProps {
  substances: string[];
  selected: string[];
  query: string;
  onToggle: (name: string) => void;
  onQuery: (value: string) => void;
  onClearAll: () => void;
}

function SubstanceSelector({
  substances,
  selected,
  query,
  onToggle,
  onQuery,
  onClearAll,
}: SubstanceSelectorProps) {
  const q = query.trim().toLowerCase();

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={styles.searchIcon}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="#777777" strokeWidth="2" />
            <path
              d="M20 20l-3.5-3.5"
              stroke="#777777"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            className={styles.search}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search substances"
            aria-label="Search substances"
          />
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClearAll}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            Clear ({selected.length})
          </button>
        )}
      </div>

      <p className={`${styles.sectionLabel} ${styles.disp}`}>
        Select substances
      </p>
      <div className={styles.chips}>
        {substances.map((name) => {
          const sel = selected.includes(name);
          const match = !q || name.toLowerCase().includes(q);
          if (!match && !sel) return null;
          return (
            <button
              key={name}
              type="button"
              className={styles.chip}
              onClick={() => onToggle(name)}
              aria-pressed={sel}
              style={{
                color: sel ? "#ffffff" : "#16507b",
                background: sel ? "var(--cc-accent)" : "#ffffff",
                border: `1px solid ${sel ? "var(--cc-accent)" : "#cde5f6"}`,
                padding: sel ? "11px 18px 11px 14px" : "11px 18px",
              }}
            >
              {sel && (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ marginLeft: "-2px" }}
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5l4.2 4.2L19 6.5"
                    stroke="#ffffff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {name}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default SubstanceSelector;
