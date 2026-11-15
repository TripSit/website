import Link from "next/link";
import type { ReactNode } from "react";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import PageShell from "../../components/PageShell";
import { solidButton } from "../../components/buttonClasses";

// Placeholder until the Google Play listing is live
const PLAY_STORE_URL = "#";
const DISCORD_URL = "https://discord.gg/3sT6w9aKV3";

// Everything below is drawn from the app's own terms and privacy policy
// (pages/reflect/terms.tsx and privacy.tsx); keep the two in step.

type Point = { icon: ReactNode; title: string; text: string };

const features: Point[] = [
  {
    icon: <EditNoteOutlinedIcon fontSize="inherit" />,
    title: "Log every session",
    text: "Record substances, doses, routes and timing alongside your mood, setting, notes and a rating. You can log doses for someone else too.",
  },
  {
    icon: <TimelineOutlinedIcon fontSize="inherit" />,
    title: "Estimated effect timeline",
    text: "See roughly where you are in an experience instead of piecing it together afterwards.",
  },
  {
    icon: <NotificationsActiveOutlinedIcon fontSize="inherit" />,
    title: "Reminders and phase alerts",
    text: "Scheduled on your phone, never through a server, and hidden from the lock screen when Privacy Mode is on.",
  },
  {
    icon: <MenuBookOutlinedIcon fontSize="inherit" />,
    title: "Substance reference",
    text: "Dosage, duration and interaction information from DoseWiki and TripSit's interaction ratings. Add your own substances and notes as well.",
  },
  {
    icon: <FingerprintOutlinedIcon fontSize="inherit" />,
    title: "Privacy Mode",
    text: "Require your screen lock, fingerprint or face before the app opens. Android does the check; Reflect never sees it.",
  },
  {
    icon: <ImportExportOutlinedIcon fontSize="inherit" />,
    title: "Your data, your call",
    text: "Export your journal to a file whenever you like, delete single entries, or wipe everything with Delete All Data.",
  },
];

const privacyPoints: Point[] = [
  {
    icon: <PhoneAndroidOutlinedIcon fontSize="inherit" />,
    title: "It stays on your phone",
    text: "No account, no server and no internet access of its own. No ads, no analytics, no tracking, and your data is never sold or shared.",
  },
  {
    icon: <PlaceOutlinedIcon fontSize="inherit" />,
    title: "Location is optional",
    text: "Read only when you ask, never in the background, and rounded to about 1 km unless you choose exact location. Android's place-name lookup, usually run by Google, receives the coordinates.",
  },
  {
    icon: <BackupOutlinedIcon fontSize="inherit" />,
    title: "Android backup is up to you",
    text: "If your phone's system backup is on, Android copies your journal and settings to it, usually your Google account. You control that in your phone's settings.",
  },
];

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-full border-[1px] border-solid border-line px-6 py-3 text-sm text-ink transition hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

function SectionHeading({
  title,
  lead,
}: Readonly<{ title: string; lead: string }>) {
  return (
    <header className="mb-10 max-w-3xl md:mb-14">
      <h2 className="m-0 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      <p className="mb-0 mt-4 text-base leading-relaxed text-mute md:text-lg">
        {lead}
      </p>
    </header>
  );
}

function PointCard({ point }: Readonly<{ point: Point }>) {
  return (
    <div className="h-full rounded-2xl border-[1px] border-solid border-line bg-surface/60 p-6">
      <span className="mb-4 inline-flex text-3xl text-cyan">{point.icon}</span>
      <h3 className="mb-2 font-display text-lg font-semibold text-ink">
        {point.title}
      </h3>
      <p className="m-0 text-sm leading-relaxed text-mute">{point.text}</p>
    </div>
  );
}

// Decorative mock of an effect timeline: two overlapping doses with
// onset / come-up / peak / offset phases and a "now" marker
function TimelinePreview() {
  return (
    <figure className="mx-auto w-full max-w-md rounded-[2rem] border-[1px] border-solid border-line bg-surface/80 p-6 shadow-2xl shadow-violet/10 backdrop-blur">
      <figcaption className="sr-only">
        Illustration of an estimated effect timeline showing two overlapping
        doses
      </figcaption>
      <div aria-hidden="true">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-ink">
            Active session
          </span>
          <span className="rounded-full bg-cyan/15 px-3 py-1 text-xs font-medium text-cyan">
            Peak
          </span>
        </div>
        <svg viewBox="0 0 320 190" className="block h-auto w-full" aria-hidden>
          <defs>
            <linearGradient
              id="reflect-fill-violet"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#a06bff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a06bff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="reflect-fill-cyan" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#46d8ec" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#46d8ec" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="10" y1="160" x2="310" y2="160" className="stroke-line" />
          <path
            d="M10 160 C 45 160, 60 40, 100 40 L 150 40 C 195 40, 215 160, 265 160 Z"
            fill="url(#reflect-fill-violet)"
          />
          <path
            d="M10 160 C 45 160, 60 40, 100 40 L 150 40 C 195 40, 215 160, 265 160"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-violet"
          />
          <path
            d="M80 160 C 110 160, 120 85, 155 85 L 185 85 C 225 85, 245 160, 305 160 Z"
            fill="url(#reflect-fill-cyan)"
          />
          <path
            d="M80 160 C 110 160, 120 85, 155 85 L 185 85 C 225 85, 245 160, 305 160"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-cyan"
          />
          <line
            x1="128"
            y1="18"
            x2="128"
            y2="160"
            strokeDasharray="4 4"
            className="stroke-ink/60"
          />
          <text
            x="128"
            y="12"
            textAnchor="middle"
            className="fill-ink text-[10px]"
          >
            Now
          </text>
          {[
            { x: 30, label: "Onset" },
            { x: 75, label: "Come-up" },
            { x: 125, label: "Peak" },
            { x: 215, label: "Offset" },
          ].map((phase) => (
            <text
              key={phase.label}
              x={phase.x}
              y="180"
              textAnchor="middle"
              className="fill-mute text-[10px]"
            >
              {phase.label}
            </text>
          ))}
        </svg>
        <ul className="m-0 mt-5 list-none space-y-2 pl-0 text-sm">
          <li className="flex items-center gap-3 text-ink">
            <span className="h-2.5 w-2.5 rounded-full bg-violet" />
            {"Dose 1"}
            <span className="ml-auto text-mute">2h 10m in</span>
          </li>
          <li className="flex items-center gap-3 text-ink">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan" />
            {"Dose 2"}
            <span className="ml-auto text-mute">+1h 15m</span>
          </li>
        </ul>
      </div>
    </figure>
  );
}

export default function ReflectPage() {
  return (
    <PageShell
      title="Reflect - TripSit"
      description="Reflect is TripSit's harm-reduction journal for Android: log what you took and how it went, and see an estimated effect timeline. Free, and everything stays on your phone."
    >
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-16 pt-12 md:pb-24 md:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div data-aos="fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border-[1px] border-solid border-line bg-surface/70 px-3 py-1 text-xs uppercase tracking-widest text-mute">
              <i className="bi bi-android2" aria-hidden />
              {"TripSit for Android"}
            </p>
            <h1 className="m-0 font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
              Reflect
            </h1>
            <p className="mb-0 mt-5 max-w-xl font-display text-xl text-ink md:text-2xl">
              An experience journal for the substances you take: what, when, and
              how it went.
            </p>
            <p className="mb-0 mt-4 max-w-xl leading-relaxed text-mute">
              Log a session and Reflect estimates its effect timeline, so you
              can see where you are instead of piecing it together afterwards.
              Everything you enter stays on your phone.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={PLAY_STORE_URL}
                className={`${solidButton} inline-flex items-center justify-center gap-3 bg-ink px-6 py-3`}
              >
                <i
                  className="bi bi-google-play text-2xl leading-none"
                  aria-hidden
                />
                <span className="text-left leading-tight">
                  <span className="block text-[11px] font-normal">
                    Get it on
                  </span>
                  <span className="block font-display text-lg">
                    Google Play
                  </span>
                </span>
              </a>
              <a href={DISCORD_URL} className={outlineButton}>
                <i className="bi bi-discord" aria-hidden />
                {"Join the Reflect Discord"}
              </a>
            </div>
            <p className="mb-0 mt-4 text-sm text-mute">
              Free, with no ads, in-app purchases or subscriptions. For adults
              18 and over.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="150">
            <TimelinePreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface/40 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl" data-aos="fade-up">
          <SectionHeading
            title="What it does"
            lead="Reflect keeps a record of what you took, when, and how it went, alongside the reference information you'd otherwise go looking for."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <PointCard key={feature.title} point={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="scroll-mt-20 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl" data-aos="fade-up">
          <SectionHeading
            title="Where your data goes"
            lead="Reflect records sensitive things, so here is exactly what happens to them."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {privacyPoints.map((point) => (
              <PointCard key={point.title} point={point} />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/reflect/privacy" className={outlineButton}>
              Read the privacy policy
            </Link>
            <Link href="/reflect/terms" className={outlineButton}>
              Read the terms of service
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-5 pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-4 rounded-2xl border-[1px] border-solid border-amber/40 bg-amber/5 p-6">
            <i
              className="bi bi-exclamation-triangle mt-0.5 text-xl text-amber"
              aria-hidden
            />
            <p className="m-0 text-sm leading-relaxed text-mute">
              <strong className="text-ink">
                Reflect is a harm-reduction tool, not medical advice.
              </strong>{" "}
              It doesn&apos;t encourage use. Its substance information comes
              from community-maintained sources (
              <a
                href="https://dose.wiki"
                className="text-cyan underline underline-offset-2 hover:text-cyan"
              >
                DoseWiki
              </a>{" "}
              and TripSit&apos;s interaction ratings) and can be incomplete or
              wrong, and effect timelines are estimates. In an emergency, call
              your local emergency number.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
