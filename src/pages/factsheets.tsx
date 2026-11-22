import React from "react";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { fetchDrugs } from "../utils/drugs";
import Header from "../components/Header";
import Head from "../components/Head";
import Factsheets from "../components/Factsheets";

type Props = { directory?: { name: string; pretty_name: string }[] };

// Keep crawlable links in the initial HTML, independently of the interactive table.
export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: {
    directory: (await fetchDrugs()).map(({ name, pretty_name }) => ({
      name,
      pretty_name,
    })),
  },
  revalidate: 3600,
});

export default function Home({ directory = [] }: Readonly<Props>) {
  return (
    <>
      <Header />
      <Head
        title="Drug Factsheets - TripSit"
        description="Dose ranges, durations, effects, interactions and reagent test results for hundreds of substances, from TripSit's open drug database."
        path="/factsheets"
      />
      <main id="main">
        <section id="factsheets">
          <Factsheets />
        </section>
        {/* Outside #factsheets: that section is exactly one screen tall (style.css sets
            height: 100vh for the table) and every section has overflow: hidden, so inside
            it this list was cut off where no visitor could scroll to it. */}
        <nav aria-label="Factsheet directory" className="container py-4">
          <h1>Drug Factsheets</h1>
          <p>
            Browse individual factsheets for substance information, effects and
            interactions.
          </p>
          <ul className="row list-unstyled">
            {directory.map(({ name, pretty_name }) => (
              <li key={name} className="col-6 col-md-4 col-lg-3">
                <Link href={`/factsheets/${encodeURIComponent(name)}`}>
                  {pretty_name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
