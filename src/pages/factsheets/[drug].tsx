import type { GetStaticPaths, GetStaticProps } from "next";
import type { Drug } from "tripsit_drug_db";
import { fetchDrugs } from "../../utils/drugs";

import Header from "../../components/Header";
import Head from "../../components/Head";

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
  return drugs.find(
    (drug) =>
      drug.name.toLowerCase() === wanted ||
      drug.pretty_name.toLowerCase() === wanted ||
      drug.aliases?.some((alias) => alias.toLowerCase() === wanted),
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
  return { props: { drugData }, revalidate: REVALIDATE_SECONDS };
};

export default function DrugInfo({ drugData }: Readonly<Props>) {
  return (
    <>
      <Header />
      <Head />
      <section id="drugInfo">
        <DrugInfoCard drugData={drugData} />
      </section>
    </>
  );
}
