import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Paths start with "/" so they also load under /factsheets/<drug>. */}
          <link href="/assets/img/favicon.png" rel="icon" />
        </Head>
        <body>
          <Main />
          {/* Bootstrap's JS runs the collapse on the appeal page (data-bs-toggle). */}
          <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></Script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
