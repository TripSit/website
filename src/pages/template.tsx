/* eslint-disable arrow-parens */
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "../components/Head";

export default function Home() {
  return (
    <div data-bs-theme="dark">
      <Header />
      <Head />
      <main id="main">
        <section id="webchat" className="d-flex align-items-center">
          <p>hi there</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
