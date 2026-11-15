// We use this because we have the _unit property
// Make things easier to read

import { useRouter } from "next/router";

import React from "react";
import { useDrugs } from "../../utils/drugs";

import Header from "../../components/Header";
import Head from "../../components/Head";

import DrugInfoCard from "../../components/DrugInfo";

export default function DrugInfo() {
  const { data = [] } = useDrugs();

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
