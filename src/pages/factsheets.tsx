import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "../components/Head";
import Factsheets from "../components/Factsheets";

export default function Home() {
  return (
    <>
      <Header />
      <Head />
      <section id="factsheets" className="d-flex align-items-center">
        <Factsheets />
      </section>
      <Footer />
    </>
  );
}
