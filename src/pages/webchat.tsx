import React from "react";
// import WidgetBot from "@widgetbot/react-embed";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "../components/Head";
import Webchat from "../components/Webchat";

export default function Home() {
  return (
    <>
      <Header />
      <Head />
      <section id="webchat" className="d-flex align-items-center">
        <Webchat />
      </section>
      <Footer />
    </>
  );
}
