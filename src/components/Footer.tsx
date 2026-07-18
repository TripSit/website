import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/img/logo.png";

const columns = [
  {
    title: "Useful Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/#about" },
      {
        label: "Terms of service",
        href: "https://wiki.tripsit.me/wiki/Terms_of_Service",
      },
      {
        label: "Privacy policy",
        href: "https://wiki.tripsit.me/wiki/Privacy_Policy",
      },
      { label: "Team Portal", href: "https://home.tripsit.me/" },
    ],
  },
  {
    title: "Our Services",
    links: [
      { label: "Combo App", href: "https://combo.tripsit.me/" },
      { label: "Factsheets", href: "https://drugs.tripsit.me/" },
      { label: "Live Chat", href: "https://chat.tripsit.me" },
      {
        label: "Android App",
        href: "https://play.google.com/store/apps/details?id=me.tripsit.mobile",
      },
      { label: "Learning Portal", href: "https://learn.tripsit.me/" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Discord",
        href: "https://discord.gg/tripsit",
        icon: "bxl-discord",
      },
      {
        label: "Twitter",
        href: "https://twitter.com/teamtripsit",
        icon: "bxl-twitter",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/TripSitme",
        icon: "bxl-facebook",
      },
      {
        label: "Reddit",
        href: "http://reddit.com/r/TripSit",
        icon: "bxl-reddit",
      },
      {
        label: "Matrix",
        href: "http://element.tripsit.me",
        icon: "bx-message-square-dots",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/tripsit",
        icon: "bxl-linkedin",
      },
    ],
  },
];

const footerLinkClass =
  "text-sm text-mute transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-night px-5 text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-block">
            <Image src={logo} alt="TripSit" className="h-10 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
            Harm Reduction Through Education. A volunteer-run community since
            2011.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-mute">
              {column.title}
            </p>
            <ul className="list-none space-y-2.5 pl-0">
              {column.links.map((link) => {
                const Comp = link.href.startsWith("/") ? Link : "a";
                return (
                  <li key={link.label}>
                    <Comp href={link.href} className={footerLinkClass}>
                      {"icon" in link && (
                        <i
                          className={`bx ${link.icon} mr-2 align-middle text-base text-violet`}
                          aria-hidden
                        />
                      )}
                      {link.label}
                    </Comp>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 py-6 text-center text-xs text-mute sm:flex-row sm:justify-between sm:text-left">
          <p>&copy; {new Date().getFullYear()} TripSit. All Rights Reserved.</p>
          <p>
            Made with{" "}
            <i className="bx bxs-heart align-middle text-violet" aria-hidden />
            <span className="sr-only">love</span> by{" "}
            <a
              href="https://github.com/LunaUrsa"
              className="text-ink transition hover:text-cyan"
            >
              Moonbear
            </a>
            ,{" "}
            <a
              href="https://github.com/Sympact06"
              className="text-ink transition hover:text-cyan"
            >
              Sympact06
            </a>{" "}
            and Team TripSit
          </p>
        </div>
      </div>
    </footer>
  );
}
