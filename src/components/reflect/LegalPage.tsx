import Link from "next/link";
import type { ReactNode } from "react";
import PageShell from "../PageShell";

// Typography for the legal text itself. No Tailwind preflight here, so the
// child margins are set explicitly to beat Bootstrap's heading/paragraph rules.
const proseClass =
  "mt-10 leading-relaxed text-mute [&>*]:mb-0 [&>*+*]:mt-4 [&>h2]:mt-10 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-ink [&>h3]:mt-8 [&>h3]:font-display [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-ink [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cyan [&_strong]:text-ink [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li+li]:mt-1";

export default function LegalPage({
  title,
  updated,
  description,
  children,
}: Readonly<{
  title: string;
  updated: string;
  description: string;
  children: ReactNode;
}>) {
  return (
    <PageShell title={`${title} - Reflect - TripSit`} description={description}>
      <article className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/reflect"
            className="inline-flex items-center gap-1.5 text-sm text-mute transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            <i className="bi bi-arrow-left" aria-hidden />
            {"Back to Reflect"}
          </Link>
          <p className="mb-0 mt-8 text-xs font-semibold uppercase tracking-widest text-violet">
            Reflect
          </p>
          <h1 className="mb-0 mt-2 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mb-0 mt-3 text-sm text-mute">Last updated: {updated}</p>
          <div className={proseClass}>{children}</div>
        </div>
      </article>
    </PageShell>
  );
}
