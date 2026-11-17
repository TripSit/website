import Link from "next/link";
import type { ReactNode } from "react";
import PageShell from "./PageShell";

// Typography for the legal text itself. No Tailwind preflight here, so the
// child margins are set explicitly to beat Bootstrap's heading, paragraph and
// list rules. Nested ordered lists count 1, a, i, so rules read as "4b".
// Headings clear the fixed header when a #section link jumps to them. Long
// URLs used as link text wrap, so they can't widen the page on a phone.
const proseClass =
  "mt-10 leading-relaxed text-mute [&>*]:mb-0 [&>*+*]:mt-4 [&>h2]:mt-10 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-ink [&>h3]:mt-8 [&>h3]:font-display [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-ink [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2 [&_a]:wrap-break-word [&_a:hover]:text-cyan [&_strong]:text-ink [&_code]:break-all [&_code]:text-ink [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman] [&_ul]:list-disc [&_ul]:pl-6 [&_ul_ul]:list-[circle] [&_li+li]:mt-1 [&_li>*]:mb-0 [&_li>*+*]:mt-1";

// A page of legal or policy text: a title, the date it last changed and the
// text. Pass the text as children (JSX) or as html (rendered from markdown at
// build time). A section, such as Reflect, adds its name above the title and
// a link back to it.
export default function LegalPage({
  title,
  updated,
  description,
  path,
  section,
  html,
  children,
}: Readonly<{
  title: string;
  updated: string;
  description: string;
  path: string;
  section?: { label: string; href: string };
  html?: string;
  children?: ReactNode;
}>) {
  return (
    <PageShell
      title={
        section ? `${title} - ${section.label} - TripSit` : `${title} - TripSit`
      }
      description={description}
      path={path}
    >
      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {section && (
            <>
              <Link
                href={section.href}
                className="inline-flex items-center gap-1.5 text-sm text-mute transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <i className="bi bi-arrow-left" aria-hidden />
                {`Back to ${section.label}`}
              </Link>
              <p className="mb-0 mt-8 text-xs font-semibold uppercase tracking-widest text-violet">
                {section.label}
              </p>
            </>
          )}
          <h1
            className={`mb-0 ${section ? "mt-2" : "mt-0"} font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl`}
          >
            {title}
          </h1>
          <p className="mb-0 mt-3 text-sm text-mute">Last updated: {updated}</p>
          {html === undefined ? (
            <div className={proseClass}>{children}</div>
          ) : (
            <div
              className={proseClass}
              // The html comes from markdown in this repo (src/content), with
              // raw HTML turned off, so it holds only what the markdown says.
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </article>
    </PageShell>
  );
}
