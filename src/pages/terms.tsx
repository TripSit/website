import type { GetStaticProps } from "next";
import LegalPage from "../components/LegalPage";
import { renderContent } from "../utils/markdown";

type Props = { html: string };

// The text lives in src/content/terms.md and becomes HTML when the site is
// built. When it changes, change the date below too.
export const getStaticProps: GetStaticProps<Props> = () => ({
  props: { html: renderContent("terms.md") },
});

export default function TermsPage({ html }: Readonly<Props>) {
  return (
    <LegalPage
      title="Terms of Service"
      updated="16 November 2026"
      path="/terms"
      description="TripSit's network terms of service: the rules for our Discord, IRC, website and other services, how to report rule breaking and how to appeal a ban."
      html={html}
    />
  );
}
