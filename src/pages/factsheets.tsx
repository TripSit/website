import React from "react";
import Header from "../components/Header";
import Head from "../components/Head";
import Factsheets from "../components/Factsheets";

export default function Home() {
  return (
    <>
      <Header />
      <Head />
      <section id="factsheets">
        <Factsheets />
      </section>
    </>
  );
}
