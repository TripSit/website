import type { ReactNode } from "react";
import PageShell from "../PageShell";

// Shared layout for the dosing calculators (/benzos, /dxm, /volume). These used to be
// separate apps on their own subdomains; new calculators should use this too.
export default function CalculatorPage({
  title,
  description,
  path,
  intro,
  children,
}: Readonly<{
  title: string;
  description: string;
  path: string;
  intro: ReactNode;
  children: ReactNode;
}>) {
  return (
    <PageShell
      title={`${title} - TripSit`}
      description={description}
      path={path}
    >
      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-0 text-xs font-semibold uppercase tracking-widest text-violet">
            Calculators
          </p>
          <h1 className="mb-0 mt-2 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <div className="mt-6 max-w-3xl text-base leading-relaxed text-mute md:text-lg [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-0 [&_p+p]:mt-4">
            {intro}
          </div>
          <div className="mt-12">{children}</div>
          <p className="mb-0 mt-12 max-w-3xl text-sm leading-relaxed text-mute [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2">
            The TripSit team built and tested these tools as carefully as we
            can, but mistakes can still happen. Always check your maths and be
            careful. Questions, suggestions or a wrong result?{" "}
            <a href="https://discord.gg/tripsit">Let us know on Discord</a>.
          </p>
        </div>
      </article>
    </PageShell>
  );
}

// Global Bootstrap and the legacy style.css also style these pages. Bootstrap's
// spacing utilities share Tailwind's names but are !important, and its *-5 is
// 3rem (Tailwind: 1.25rem); *-3 and *-4 are slightly bigger too. style.css pads
// every <section> by 80px unless a padding class overrides it. So use steps
// Bootstrap lacks (6+) where size matters, and <div> for inner blocks.

// Text inputs and read-only results share one look across the calculators.
export const fieldClass =
  "w-24 rounded-lg border-[1px] border-solid border-line bg-night px-3 py-2 text-center text-ink focus-visible:border-cyan focus-visible:outline-none";

export const selectClass =
  "max-w-full rounded-lg border-[1px] border-solid border-line bg-night px-3 py-2 text-ink focus-visible:border-cyan focus-visible:outline-none";

export const cardClass =
  "rounded-2xl border-[1px] border-solid border-line bg-surface/60 p-6";
