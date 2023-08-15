// import Head from 'next/head';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <main id="main">
        <section className="breadcrumbs">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Inner Page</h2>
              <ol>
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>Inner Page</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="inner-page">
          <div className="container">
            <p>Example inner page template</p>
          </div>
        </section>
      </main>

      <Footer />

      <div id="preloader"></div>
      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
}
