import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import logo from "../../public/assets/img/logo.png";
import ProfileButton from "./ProfileButton";

const domain = process.env.NEXT_PUBLIC_DNS_DOMAIN || "tripsit.me";

type NavLink = { label: string; href: string; note?: string };
type NavGroup = { label: string; links: NavLink[] };

const directLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
];

const menus: { label: string; groups: NavGroup[] }[] = [
  {
    label: "Resources",
    groups: [
      {
        label: "Drug Info",
        links: [
          { label: "Wiki", href: `https://wiki.${domain}/wiki/Main_Page` },
          { label: "Factsheets", href: "/factsheets" },
          { label: "Comboapp", href: "/combo" },
          { label: "Printing Information", href: "/#faq" },
          {
            label: "Drug User's Handbook",
            href: "https://www.reddit.com/r/Drugs/comments/131q1yb/the_drug_users_bible_download_it_free_of_charge/",
          },
        ],
      },
      {
        label: "Calculators",
        links: [
          { label: "DXM Dosage", href: `https://dxm.${domain}` },
          { label: "Volumetric", href: `https://volume.${domain}` },
          { label: "Benzo Conversion", href: `https://benzos.${domain}` },
        ],
      },
      {
        label: "Test Kits",
        links: [
          {
            label: "DanceSafe (Worldwide)",
            href: "https://dancesafe.org/product-category/testing-strips/",
          },
          {
            label: "ProTest (Europe)",
            href: "https://protestkit.eu/shop/?coupon_code=tripsit",
            note: "10% off with 'TripSit'",
          },
          {
            label: "ReagentTests (UK)",
            href: "https://www.reagent-tests.uk/shop/",
            note: "10% off with 'tripsitwiki'",
          },
          { label: "EZ Test (Australia)", href: "https://ez-test.com.au/" },
          { label: "Test Drogue (France)", href: "https://www.testdrogue.fr/" },
          {
            label: "Test Kit Instructions",
            href: "https://dancesafe.org/testing-kit-instructions/",
          },
          {
            label: "Fentanyl strip guide",
            href: "https://dancesafe.org/fentanyl",
          },
        ],
      },
      {
        label: "More",
        links: [
          { label: "Learning Platform", href: `https://learn.${domain}` },
          {
            label: "Android App",
            href: "https://play.google.com/store/apps/details?id=me.tripsit.mobile&hl=en_US&gl=US",
          },
          {
            label: "Service Status",
            href: `https://uptime.${domain}/status/default`,
          },
        ],
      },
    ],
  },
  {
    label: "Guides",
    groups: [
      {
        label: "Harm Reduction",
        links: [
          {
            label: "Psychedelic Myths",
            href: `https://wiki.${domain}/wiki/Common_Misconceptions_About_Psychedelics`,
          },
          { label: "Test Kits", href: `https://wiki.${domain}/wiki/Test_Kits` },
          { label: "Scales", href: `https://wiki.${domain}/wiki/Scales` },
          { label: "Storage", href: `https://wiki.${domain}/wiki/Storage` },
          {
            label: "Laboratory Analysis",
            href: `https://wiki.${domain}/wiki/Sources_for_Laboratory_Analysis`,
          },
        ],
      },
      {
        label: "TripSitting",
        links: [
          { label: "Intro to TripSitting", href: "https://learn.tripsit.me" },
          {
            label: "Hallucinogens",
            href: `https://wiki.${domain}/wiki/Hallucinogens`,
          },
          {
            label: "TripSit in real life",
            href: `https://wiki.${domain}/wiki/How_To_Tripsit_In_Real_Life`,
          },
          {
            label: "TripSit online",
            href: `https://wiki.${domain}/wiki/How_To_Tripsit_Online`,
          },
          {
            label: "Deal with a bad trip",
            href: `https://wiki.${domain}/wiki/How_To_Deal_With_A_Bad_Trip`,
          },
        ],
      },
      {
        label: "Recovery",
        links: [
          {
            label: "Stimulant Comedowns",
            href: `https://wiki.${domain}/wiki/Quick_Guide_to_Stimulant_Comedowns`,
          },
          { label: "HPPD", href: `https://wiki.${domain}/wiki/HPPD` },
          {
            label: "Guide to Withdrawals",
            href: `https://wiki.${domain}/wiki/Guide_to_Withdrawals`,
          },
          {
            label: "Addiction",
            href: `https://wiki.${domain}/wiki/Addiction`,
          },
          {
            label: "Professional Help Resources",
            href: `https://wiki.${domain}/wiki/Professional_Help_Resources`,
          },
        ],
      },
      {
        label: "Dosing",
        links: [
          {
            label: "Volumetric Dosing",
            href: `https://wiki.${domain}/wiki/Quick_Guide_to_Volumetric_Dosing`,
          },
          {
            label: "Rectal Administration (Plugging)",
            href: `https://wiki.${domain}/wiki/Quick_Guide_to_Plugging`,
          },
          {
            label: "Reducing Snorting Pain",
            href: `https://wiki.${domain}/wiki/Reducing_Pain_Caused_by_Insufflation`,
          },
          {
            label: "Cannabinoid Eliquid",
            href: `https://wiki.${domain}/wiki/Cannabinoid_Eliquid`,
          },
          {
            label: "Cold Water Extraction",
            href: `https://wiki.${domain}/wiki/Cold_Water_Extraction`,
          },
          {
            label: "Acid-to-base Reduction",
            href: `https://wiki.${domain}/wiki/Zim%27s_Clarified_ATB_Hybrid_Salt_Tek`,
          },
        ],
      },
    ],
  },
];

const trailingLinks: NavLink[] = [
  { label: "Volunteer", href: "/#cta" },
  { label: "FAQ", href: "/#faq" },
  { label: "Updates", href: `https://updates.${domain}` },
  { label: "Ban Appeal", href: "/appeal" },
];

const isInternal = (href: string) => href.startsWith("/");

function NavAnchor({
  link,
  className,
  onNavigate,
}: {
  link: NavLink;
  className: string;
  onNavigate?: () => void;
}) {
  if (isInternal(link.href)) {
    return (
      <Link href={link.href} className={className} onClick={onNavigate}>
        {link.label}
        {link.note && (
          <span className="mt-0.5 block text-xs text-mute">{link.note}</span>
        )}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className} onClick={onNavigate}>
      {link.label}
      {link.note && (
        <span className="mt-0.5 block text-xs text-mute">{link.note}</span>
      )}
    </a>
  );
}

// No Tailwind preflight in this project, so <button> needs its UA chrome
// stripped explicitly to look like the sibling links
const buttonReset =
  "appearance-none [background:none] [border:none] [font:inherit]";
const topLinkClass =
  "rounded-lg px-3 py-2 text-sm text-mute transition hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";
const panelLinkClass =
  "block rounded-md px-2 py-1.5 text-sm text-ink transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("header")) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Grace period so the pointer can travel from trigger to panel without
  // the menu snapping shut the moment it leaves the trigger box
  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  };

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-night/85 text-ink backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
          <Link href="/" className="shrink-0" onClick={closeAll}>
            <Image src={logo} alt="TripSit home" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="relative hidden items-center lg:flex"
            aria-label="Main"
          >
            {directLinks.map((link) => (
              <NavAnchor
                key={link.label}
                link={link}
                className={topLinkClass}
              />
            ))}

            {menus.map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => openNow(menu.label)}
                onMouseLeave={closeSoon}
              >
                <button
                  type="button"
                  className={`${buttonReset} ${topLinkClass} inline-flex cursor-pointer items-center gap-1.5`}
                  aria-expanded={openMenu === menu.label}
                  onClick={() =>
                    setOpenMenu(openMenu === menu.label ? null : menu.label)
                  }
                >
                  {menu.label}
                  <i
                    className={`bi bi-chevron-down text-xs transition-transform ${
                      openMenu === menu.label ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {openMenu === menu.label && (
                  <div className="absolute left-1/2 top-full w-max -translate-x-1/2 pt-3">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-6 rounded-2xl border-[1px] border-solid border-line bg-surface p-6 shadow-2xl shadow-night/60">
                      {menu.groups.map((group) => (
                        <div key={group.label} className="min-w-40">
                          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-mute">
                            {group.label}
                          </p>
                          <ul className="list-none pl-0">
                            {group.links.map((link) => (
                              <li key={link.label}>
                                <NavAnchor
                                  link={link}
                                  className={panelLinkClass}
                                  onNavigate={closeAll}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {trailingLinks.map((link) => (
              <NavAnchor
                key={link.label}
                link={link}
                className={topLinkClass}
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://discord.gg/tripsit"
              className="hidden rounded-full border-[1px] border-solid border-cyan px-4 py-2 text-sm text-cyan transition hover:bg-cyan/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:block"
            >
              Join Discord
            </a>
            <Link
              href="/webchat"
              className="hidden rounded-full bg-violet px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:block"
              onClick={closeAll}
            >
              Get Help Now
            </Link>
            <ProfileButton />
            <button
              type="button"
              className={`${buttonReset} cursor-pointer rounded-lg p-2 text-2xl leading-none text-ink transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan lg:hidden`}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <i
                className={`bi ${mobileOpen ? "bi-x-lg" : "bi-list"}`}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu is a sibling of the header: its backdrop-blur creates a
          containing block that would trap a fixed child at header height */}
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto border-t border-line/60 bg-night px-5 pb-16 pt-6 text-ink lg:hidden"
        >
          <div className="mb-6 flex gap-3 md:hidden">
            <Link
              href="/webchat"
              className="flex-1 rounded-full bg-violet px-4 py-2.5 text-center text-sm font-semibold text-night"
              onClick={closeAll}
            >
              Get Help Now
            </Link>
            <a
              href="https://discord.gg/tripsit"
              className="flex-1 rounded-full border-[1px] border-solid border-line px-4 py-2.5 text-center text-sm text-ink"
            >
              Join Discord
            </a>
          </div>

          <ul className="mb-8 list-none space-y-1 pl-0">
            {[...directLinks, ...trailingLinks].map((link) => (
              <li key={link.label}>
                <NavAnchor
                  link={link}
                  className="block rounded-lg px-2 py-2.5 font-display text-lg text-ink"
                  onNavigate={closeAll}
                />
              </li>
            ))}
          </ul>

          {menus.map((menu) => (
            <div key={menu.label} className="mb-8">
              <p className="mb-2 px-2 font-display text-lg font-semibold text-violet">
                {menu.label}
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {menu.groups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-mute">
                      {group.label}
                    </p>
                    <ul className="list-none pl-0">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <NavAnchor
                            link={link}
                            className="block rounded-md px-2 py-2 text-sm text-ink"
                            onNavigate={closeAll}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}
    </>
  );
}

export default Header;
