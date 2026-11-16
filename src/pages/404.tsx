import Link from "next/link";
import BlogSuggestion from "../components/BlogSuggestion";
import PageShell from "../components/PageShell";
import { solidButton } from "../components/buttonClasses";
import { envOrDefault } from "../utils/envOrDefault";

const domain = envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me");

// Shown for every URL that matches no page. People arrive here from old article links and
// out-of-date links elsewhere, so it keeps the site's header and footer and says where to
// get help. Never fetch or redirect to URLs built from request headers here (SSRF and open
// redirect, WEB-002, fixed in #247); only link to the blog on a fixed host.
export default function NotFoundPage() {
  return (
    <PageShell
      title="Page not found - TripSit"
      description="The page you were looking for doesn't exist or has moved."
    >
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-mute">
          <p className="mb-0 text-xs font-semibold uppercase tracking-widest text-violet">
            404
          </p>
          <h1 className="mb-0 mt-2 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Page not found
          </h1>
          <p className="mb-0 mt-6">
            We couldn&apos;t find that page. It may have moved, or the link may
            be out of date.
          </p>
          <div className="mt-4 [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-0">
            <BlogSuggestion blogOrigin={`https://updates.${domain}`} />
          </div>
          <p className="mb-0 mt-8">
            If you need someone to talk to right now, our team is here.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/webchat"
              className={`${solidButton} bg-violet px-5 py-2.5 text-sm`}
            >
              Get Help Now
            </Link>
            <Link
              href="/"
              className="text-sm text-cyan underline underline-offset-2"
            >
              Return home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
