import Link from "next/link";
import PageShell from "../../components/PageShell";
import { solidButton } from "../../components/buttonClasses";

const commands = [
  { command: "/help", description: "Explore the commands available to you." },
  { command: "/drug", description: "Look up substance information." },
  {
    command: "/combo",
    description: "Check TripSit's interaction information.",
  },
  { command: "/remind_me", description: "Set and manage personal reminders." },
];

const linkClass =
  "text-cyan underline underline-offset-4 transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

export default function TripBotPage() {
  return (
    <PageShell
      title="TripBot - TripSit"
      description="Meet TripBot, TripSit's Discord bot for harm-reduction information, personal records, reminders, and community tools."
      path="/tripbot"
    >
      <section className="border-b border-line/60 px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet">
              A TripSit project
            </p>
            <h1 className="m-0 font-display text-5xl font-semibold tracking-tight text-ink md:text-7xl">
              TripBot
            </h1>
            <p className="mb-0 mt-5 font-display text-2xl leading-snug text-ink md:text-3xl">
              A little help, right in Discord.
            </p>
            <p className="mb-0 mt-5 max-w-xl text-lg leading-relaxed text-mute">
              Look up harm-reduction information, keep personal records, set
              reminders, and take part in the community. TripBot brings
              TripSit&apos;s tools into the conversation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="https://discord.gg/tripsit"
                className={`${solidButton} inline-flex bg-cyan px-6 py-3 text-base`}
              >
                Join TripSit on Discord
              </a>
              <Link href="/tripbot/privacy" className={linkClass}>
                Read the privacy policy
              </Link>
            </div>
          </div>
          <aside
            aria-labelledby="commands-heading"
            className="rounded-2xl border-[1px] border-solid border-line bg-surface/60 p-6 md:p-8"
          >
            <h2
              id="commands-heading"
              className="m-0 font-display text-2xl font-semibold text-ink"
            >
              Start with a slash
            </h2>
            <p className="mb-0 mt-3 text-base leading-relaxed text-mute">
              Type <code className="text-ink">/help</code> in Discord to browse
              TripBot&apos;s commands. Availability depends on the server,
              channel, and your permissions.
            </p>
            <dl className="mb-0 mt-6 divide-y divide-line">
              {commands.map(({ command, description }) => (
                <div key={command} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-base font-semibold text-cyan">
                    <code className="text-cyan">{command}</code>
                  </dt>
                  <dd className="mb-0 ml-0 mt-1 text-base leading-relaxed text-mute">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20" aria-labelledby="tools-heading">
        <div className="mx-auto max-w-6xl">
          <h2
            id="tools-heading"
            className="m-0 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl"
          >
            Information, records, and a human community
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="m-0 font-display text-xl font-semibold text-ink">
                Find information
              </h3>
              <p className="mb-0 mt-3 text-base leading-relaxed text-mute">
                Use substance lookups and interaction information as a starting
                point for research. The bot is a tool for education, not medical
                advice or a guarantee that a combination is safe.
              </p>
            </div>
            <div>
              <h3 className="m-0 font-display text-xl font-semibold text-ink">
                Keep track
              </h3>
              <p className="mb-0 mt-3 text-base leading-relaxed text-mute">
                Record substances, amounts, routes, and times with{" "}
                <code className="text-ink">/idose</code>. Use{" "}
                <code className="text-ink">/remind_me</code> to set a reminder.
                These features store information with TripBot; they are not an
                offline journal.
              </p>
            </div>
            <div>
              <h3 className="m-0 font-display text-xl font-semibold text-ink">
                Connect with people
              </h3>
              <p className="mb-0 mt-3 text-base leading-relaxed text-mute">
                TripBot supports TripSit&apos;s help sessions, moderation, and
                community features. If you need to talk, our{" "}
                <Link href="/webchat" className={linkClass}>
                  live chat
                </Link>{" "}
                connects you with volunteers. The bot does not replace human
                support or emergency services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-line/60 bg-surface/40 px-6 py-16 md:py-20"
        aria-labelledby="privacy-heading"
      >
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <h2
              id="privacy-heading"
              className="m-0 font-display text-3xl font-semibold tracking-tight text-ink"
            >
              Know what you share
            </h2>
            <p className="mb-0 mt-4 text-base leading-relaxed text-mute">
              TripBot reads messages to run its text commands and active
              features. In bridged channels, your messages go to IRC only while
              you have the <strong className="text-ink">IRC Bridge</strong>{" "}
              role. Removing it stops future relays; copies already sent may
              remain on IRC.
            </p>
          </div>
          <div>
            <p className="m-0 text-base leading-relaxed text-mute">
              Use <code className="text-ink">/privacy get</code> for a summary
              of your stored data and{" "}
              <code className="text-ink">/privacy delete</code> to request
              deletion. The command has limits: it does not erase ordinary
              Discord messages, previously relayed IRC copies, or hosting logs
              and backups.
            </p>
            <p className="mb-0 mt-5 text-base">
              <Link href="/tripbot/privacy" className={linkClass}>
                Storage, retention, and deletion details
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8">
          <div>
            <h2 className="m-0 font-display text-xl font-semibold text-ink">
              Built by the TripSit community
            </h2>
            <p className="mb-0 mt-3 text-base leading-relaxed text-mute">
              Explore the code, report a bug, or help improve TripBot.
            </p>
            <a
              href="https://github.com/TripSit/TripBot"
              className={`${linkClass} mt-3 inline-block text-base`}
            >
              TripBot on GitHub
            </a>
          </div>
          <p className="m-0 max-w-sm text-base leading-relaxed text-mute">
            Privacy questions? Email{" "}
            <a href="mailto:privacy@tripsit.me" className={linkClass}>
              privacy@tripsit.me
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
