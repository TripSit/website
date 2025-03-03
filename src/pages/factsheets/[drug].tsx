/* eslint-disable no-underscore-dangle */ // We use this because we have the _unit property
/* eslint-disable sonarjs/no-duplicate-string */ // Make things easier to read

import { useRouter } from "next/router";

import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query"; // note: this is TanStack Rea`ct Query V5
import { Drug } from "tripsit_drug_db";

import Header from "../../components/Header";
import Head from "../../components/Head";

import DrugInfoCard from "../../components/DrugInfo";

// If you want to debug a specific drug, change the below variable to the name of the drug
// and then use the commented-out code below that to display what you need to debug
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugDrug = "cocaine";
// if (drugData.original.name === debugDrug) {
//   console.log(`roaString: ${JSON.stringify(roaString, null, 2)}`);
// }

export default function DrugInfo() {
  const {
    data: { data = [] } = {}, // your data and api response will probably be different
  } = useQuery<{
    data: Array<Drug>;
  }>({
    queryKey: ["table-data"],
    queryFn: async () => {
      let drugList = [] as Drug[];
      const response = await fetch(
        // TripSit's drug database file
        // This is fetched every time the user loads the page to ensure they have the latest data
        "https://raw.githubusercontent.com/TripSit/drugs/main/drugs.json",
      );
      drugList = Object.values(
        (await response.json()) as { [key: string]: Drug },
      );
      return {
        data: drugList,
      };
    },
    placeholderData: keepPreviousData,
  });

  // Go through the drug list and find the drug that matches the name, pretty_name, or any aliases we're looking for
  const router = useRouter();
  const drugName = router.query.drug;

  if (!drugName) {
    return (
      <>
        <h1>Drug not found, not JavaScript is not enabled.</h1>
        <p>
          The drug you&apos;re looking for doesn&apos;t exist in the database.
          If you think this is an error, please{" "}
          <a href="https://discord.gg/tripsit">contact us on Discord</a>.
        </p>
      </>
    );
  }

  // Check if the drugName is an array and if so, show an error
  if (Array.isArray(drugName)) {
    return (
      <>
        <h1>Drug not found, not JavaScript is not enabled.</h1>
        <p>
          The drug you&apos;re looking for doesn&apos;t exist in the database.
          If you think this is an error, please{" "}
          <a href="https://discord.gg/tripsit">contact us on Discord</a>.
        </p>
      </>
    );
  }

  const drugData = data.find(
    (drug) =>
      drug.name.toLowerCase() === drugName.toLowerCase() ||
      drug.pretty_name.toLowerCase() === drugName.toLowerCase() ||
      drug.aliases?.includes(drugName.toLowerCase()),
  );

  if (!drugData) {
    return (
      <>
        <h1>Drug not found, not JavaScript is not enabled.</h1>
        <p>
          The drug you&apos;re looking for doesn&apos;t exist in the database.
          If you think this is an error, please{" "}
          <a href="https://discord.gg/tripsit">contact us on Discord</a>.
        </p>
      </>
    );
  }

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
