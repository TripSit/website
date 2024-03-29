// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html>
        <Head>
          {/* <!-- Favicons --> */}
          <link href="assets/img/favicon.png" rel="icon" />
          <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" />

          {/* <!-- Google Fonts --> */}
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          {/* <!-- Vendor JS Files --> */}
          <Script src="assets/vendor/aos/aos.js"></Script>
          <Script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></Script>
          <Script src="assets/vendor/glightbox/js/glightbox.min.js"></Script>
          <Script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></Script>
          <Script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-element-bundle.min.js"></Script>
          {/* <Script src="assets/vendor/swiper/swiper-bundle.min.js"></Script> */}
          <Script src="assets/vendor/php-email-form/validate.js"></Script>

          {/* <!-- Template Main JS File --> */}
          <Script src="assets/js/main.js"></Script>

          <NextScript />

          {/* AOS (Animate On Scroll) */}
          <link
            href="https://unpkg.com/aos@2.3.1/dist/aos.css"
            rel="stylesheet"
          />
          <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
