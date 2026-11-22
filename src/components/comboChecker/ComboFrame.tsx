import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/assets/img/logo.png";
import { poppinsVariable } from "../fonts";
import { envOrDefault } from "../../utils/envOrDefault";
import styles from "./comboChecker.module.css";

// The combination pages' top bar and footer, around the page's own <main>.
function ComboFrame({
  accent = "#2487ce",
  children,
}: Readonly<{
  /** Accent color. Design options: #2487ce, #683394, #47aeff, #11dbcf. */
  accent?: string;
  children: ReactNode;
}>) {
  const domain = envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me");
  return (
    <div
      className={`${styles.root} ${poppinsVariable}`}
      style={{ "--cc-accent": accent } as CSSProperties}
    >
      <nav className={styles.nav}>
        <a href={`https://${domain}`} className={styles.brand}>
          {/* 26px tall is about 74px wide. Without sizes, Next serves its 3840px
              variant. */}
          <Image
            src={logo}
            alt="TripSit"
            className={styles.brandLogo}
            sizes="74px"
            preload
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

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {/* 22px tall is about 63px wide. */}
          <Image
            src={logo}
            alt="TripSit"
            className={styles.footerLogo}
            sizes="63px"
          />
          <span className={styles.footerCopy}>
            © Copyright TripSit. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default ComboFrame;
