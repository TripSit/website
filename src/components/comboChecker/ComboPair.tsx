import Link from "next/link";
import type { ComboPairProps } from "../../utils/comboPair.server";
import ComboFrame from "./ComboFrame";
import styles from "./comboChecker.module.css";

// One combination's page: its rating and what the rating means, the drug team's explanation
// and sources, and where to see past reviews or suggest a change. Everything comes in as
// props, so the page doesn't load the combination database.
function ComboPair({
  first,
  second,
  rating,
  definition,
  note,
  sources,
  suggestUrl,
  reviewsUrl,
}: Readonly<ComboPairProps>) {
  const pair = `${first} + ${second}`;
  return (
    <ComboFrame>
      <main className={styles.main}>
        <p className={styles.crumb}>
          <Link href="/combo">Drug Combinations</Link>
        </p>
        <h1 className={`${styles.title} ${styles.pairTitle} ${styles.disp}`}>
          {pair}
        </h1>

        <div
          className={styles.verdict}
          style={{ background: rating.cBg, color: rating.cText }}
        >
          <span
            className={styles.verdictBadge}
            style={{ background: rating.badge }}
            aria-hidden="true"
          >
            {rating.glyph}
          </span>
          <div>
            <p className={`${styles.verdictLabel} ${styles.disp}`}>
              {rating.label}
            </p>
            {definition && <p className={styles.verdictText}>{definition}</p>}
          </div>
        </div>

        <h2 className={`${styles.pairHeading} ${styles.disp}`}>What we know</h2>
        {note ? (
          <p className={styles.pairText}>{note}</p>
        ) : (
          <p className={`${styles.pairText} ${styles.pairMissing}`}>
            No explanation has been written for this combination yet. The rating
            above is all our drug database says about it so far.
          </p>
        )}

        <h2 className={`${styles.pairHeading} ${styles.disp}`}>Sources</h2>
        {sources.length > 0 ? (
          <ol className={styles.sourceList}>
            {sources.map((source) => (
              <li key={`${source.title}|${source.url}`}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title}
                  </a>
                ) : (
                  source.title
                )}
                {source.author && (
                  <span className={styles.sourceAuthor}>{source.author}</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className={`${styles.pairText} ${styles.pairMissing}`}>
            No sources have been added for this combination yet.
          </p>
        )}

        <h2 className={`${styles.pairHeading} ${styles.disp}`}>
          Reviews and corrections
        </h2>
        <p className={styles.pairText}>
          TripSit&apos;s drug team reviews ratings in the open on GitHub. You
          can <a href={reviewsUrl}>search past reviews of {pair}</a>, or, if you
          think this rating is wrong, <a href={suggestUrl}>suggest a change</a>.
          Please include a reliable source, such as a peer-reviewed study, a
          .gov or .edu page, a book or a harm reduction organisation.
        </p>

        <div className={styles.disclaimer}>
          This page, like the combo chart, is a quick-reference guide.{" "}
          <strong>Additional research MUST always be done</strong>. When in
          doubt, don&apos;t mix; start low and go slow.
          <p>
            <Link href="/combo">Check another combination</Link> or{" "}
            <Link href="/combo/chart">view the full chart</Link>.
          </p>
        </div>
      </main>
    </ComboFrame>
  );
}

export default ComboPair;
