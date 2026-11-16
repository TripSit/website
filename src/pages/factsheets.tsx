import React from "react";
import Header from "../components/Header";
import Head from "../components/Head";
import Factsheets from "../components/Factsheets";

export default function Home() {
  return (
    <>
      <Header />
      <Head
        title="Drug Factsheets - TripSit"
        description="Dose ranges, durations, effects, interactions and reagent test results for hundreds of substances, from TripSit's open drug database."
        path="/factsheets"
      />
      <section id="factsheets">
        <Factsheets />
      </section>
    </>
  );
}
