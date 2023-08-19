import { AppProps } from "next/app";
import { useEffect } from "react";
import AOS from "aos";
// Vendor CSS Files
import "../../public/assets/vendor/aos/aos.css";
import "../../public/assets/vendor/bootstrap/css/bootstrap.min.css";
import "../../public/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../public/assets/vendor/boxicons/css/boxicons.min.css";
import "../../public/assets/vendor/glightbox/css/glightbox.min.css";
import "../../public/assets/vendor/swiper/swiper-bundle.min.css";
import "../../public/assets/vendor/remixicon/remixicon.css";
// Main CSS file
import "../../public/assets/css/style.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
