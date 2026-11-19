import styles from "./donateButtons.module.css";
import { quicksandVariable } from "./fonts";
import { BiCupHotFill } from "./icons";

// The Ko-fi donate button. It replaced the kofi-button package, which built the same button
// from raw HTML with a Google Fonts link and Ko-fi's hot-linked cup image, so every visit to
// the factsheets page told Google and ko-fi.com.
const KofiButton = ({
  color,
  title,
  kofiID,
}: Readonly<{ color: string; title: string; kofiID: string }>) => (
  <div className={styles.container}>
    <a
      title="Support TripSit on ko-fi.com"
      className={`${styles.button} ${quicksandVariable}`}
      style={{ backgroundColor: color }}
      href={`https://ko-fi.com/${kofiID}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.text}>
        <BiCupHotFill className={`${styles.cup} align-middle`} />
        {title}
      </span>
    </a>
  </div>
);

export default KofiButton;
