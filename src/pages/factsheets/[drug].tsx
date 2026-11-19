import type { GetStaticPaths, GetStaticProps } from "next";
import type { Drug } from "tripsit_drug_db";
import { fetchDrugs } from "../../utils/drugs";

import Link from "next/link";
import PageShell from "../../components/PageShell";
import { factsheetDescription } from "../../utils/factsheetDescription";
import DrugInfoCard from "../../components/DrugInfo";

type Props = { drugData: Drug };

// Factsheets are rendered on the server, so visitors and search engines get the content
// without waiting for the browser to download the database. Each page is built the first
// time someone asks for it, then rebuilt in the background at most once an hour.
export const REVALIDATE_SECONDS = 60 * 60;

// The database is one 1.6 MB file. Every factsheet built within the hour shares one
// download of it, instead of each page fetching the whole file again.
let cached: { expires: number; drugs: Promise<Drug[]> } | undefined;

function loadDrugs(): Promise<Drug[]> {
  const now = Date.now();
  if (!cached || cached.expires <= now) {
    const drugs = fetchDrugs();
    cached = { expires: now + REVALIDATE_SECONDS * 1000, drugs };
    // Forget a failed download, so the next page tries again.
    drugs.catch(() => {
      if (cached?.drugs === drugs) {
        cached = undefined;
      }
    });
  }
  return cached.drugs;
}

// Matches the name, pretty name or any alias, ignoring case.
function findDrug(drugs: Drug[], name: string): Drug | undefined {
  const wanted = name.toLowerCase();
  // A canonical database name must win over another substance's alias.
  return (
    drugs.find((drug) => drug.name.toLowerCase() === wanted) ??
    drugs.find(
      (drug) =>
        drug.pretty_name.toLowerCase() === wanted ||
        drug.aliases?.some((alias) => alias.toLowerCase() === wanted),
    )
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { drug: string }> = async ({
  params,
}) => {
  const drugData = findDrug(await loadDrugs(), params?.drug ?? "");
  if (!drugData) {
    return { notFound: true, revalidate: REVALIDATE_SECONDS };
  }
  if (params?.drug !== drugData.name) {
    return {
      redirect: {
        destination: `/factsheets/${encodeURIComponent(drugData.name)}`,
        permanent: true,
      },
      revalidate: REVALIDATE_SECONDS,
    };
  }
  return { props: { drugData }, revalidate: REVALIDATE_SECONDS };
};

export default function DrugInfo({ drugData }: Readonly<Props>) {
  const aliases = drugData.aliases ?? [];
  return (
    <PageShell
      title={`${drugData.pretty_name} - TripSit Factsheets`}
      description={factsheetDescription(drugData)}
      // The sitemap lists drugs under their database name, so the canonical link does too
      path={`/factsheets/${encodeURIComponent(drugData.name)}`}
    >
      {/* Divs rather than header/section: the legacy stylesheet pads both. The side
          padding matches the MUI Container below, so the heading lines up with the cards. */}
      <div className="px-[16px] pb-6 pt-10 sm:px-[24px] md:pt-14">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/factsheets"
            className="text-sm text-cyan underline underline-offset-2"
          >
            ← All factsheets
          </Link>
          <h1 className="mb-0 mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {drugData.pretty_name}
          </h1>
          {aliases.length > 0 && (
            <p className="mb-0 mt-2 text-mute">
              Also known as {aliases.join(", ")}
            </p>
          )}
        </div>
      </div>
      <div id="drugInfo" className="pb-12">
        <DrugInfoCard drugData={drugData} />
      </div>
    </PageShell>
  );
}
