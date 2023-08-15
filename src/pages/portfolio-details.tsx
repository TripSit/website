// import Head from 'next/head';
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import profile1 from "../../public/assets/img/portfolio/portfolio-1.jpg";
import profile2 from "../../public/assets/img/portfolio/portfolio-2.jpg";
import profile3 from "../../public/assets/img/portfolio/portfolio-3.jpg";

export default function Home() {
  return (
    <div>
      <Header />

      <main id="main">
        <section id="breadcrumbs" className="breadcrumbs">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Portfolio Details</h2>
              <ol>
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>Portfolio Details</li>
              </ol>
            </div>
          </div>
        </section>

        <section id="portfolio-details" className="portfolio-details">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-8">
                <div className="portfolio-details-slider swiper">
                  <div className="swiper-wrapper align-items-center">
                    <div className="swiper-slide">
                      <Image src={profile1} alt="" />
                    </div>

                    <div className="swiper-slide">
                      <Image src={profile2} alt="" />
                    </div>

                    <div className="swiper-slide">
                      <Image src={profile3} alt="" />
                    </div>
                  </div>
                  <div className="swiper-pagination"></div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="portfolio-info">
                  <h3>Project information</h3>
                  <ul>
                    <li>
                      <strong>Category</strong>: Web design
                    </li>
                    <li>
                      <strong>Client</strong>: ASU Company
                    </li>
                    <li>
                      <strong>Project date</strong>: 01 March, 2020
                    </li>
                    <li>
                      <strong>Project URL</strong>:{" "}
                      <a href="#">www.example.com</a>
                    </li>
                  </ul>
                </div>
                <div className="portfolio-description">
                  <h2>This is an example of portfolio detail</h2>
                  <p>Yay portfolio!</p>
                </div>
              </div>
            </div>
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
