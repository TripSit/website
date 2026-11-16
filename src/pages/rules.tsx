import type { GetStaticProps } from "next";
import LegalPage from "../components/LegalPage";
import { renderContent } from "../utils/markdown";

type Props = { html: string };

// The text lives in src/content/rules.md and becomes HTML when the site is
// built. When it changes, change the date below too.
export const getStaticProps: GetStaticProps<Props> = () => ({
  props: { html: renderContent("rules.md") },
});

export default function RulesPage({ html }: Readonly<Props>) {
  return (
    <LegalPage
      title="Rules"
      updated="16 November 2026"
      path="/rules"
      description="A summary of the rules for TripSit's Discord server, and where to appeal a ban."
      html={html}
    />
  );
}
