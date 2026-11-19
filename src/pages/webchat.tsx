import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "../components/Head";
import Webchat from "../components/Webchat";

export default function Home() {
  return (
    <>
      <Header />
      <Head
        title="Live Chat - TripSit"
        description="Talk to TripSit's volunteers in our 24/7 live chat for on-the-spot harm reduction help. We're volunteers, not medical professionals."
        path="/webchat"
      />
      <main id="main">
        <h1 className="sr-only">TripSit live chat</h1>
        <section id="webchat" className="d-flex align-items-center">
          <Webchat />
        </section>
      </main>
      <Footer />
    </>
  );
}
