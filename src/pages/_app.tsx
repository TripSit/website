/* eslint-disable no-alert */
import { AppProps } from "next/app";
import React, { useEffect } from "react";
// import React, { useEffect, useState } from "react";
import AOS from "aos";
// Vendor CSS Files
import "../../public/assets/vendor/aos/aos.css";
import "../../public/assets/vendor/bootstrap/css/bootstrap.min.css";
import "../../public/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../public/assets/vendor/boxicons/css/boxicons.min.css";
import "../../public/assets/vendor/glightbox/css/glightbox.min.css";
import "../../public/assets/vendor/swiper/swiper-bundle.min.css";
import "../../public/assets/vendor/remixicon/remixicon.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// Main CSS file
import "../../public/assets/css/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // note: this is TanStack Rea`ct Query V5
// import generateRandomString from "@/utils/randomString";

// const F = "_app.tsx";

export default function App({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [stateParam, setStateParam] = useState("");

  // const setNewStateParam = () => {
  //   const rndStr = generateRandomString();
  //   localStorage.setItem("stateParam", rndStr);
  //   setStateParam(rndStr);
  // };

  useEffect(() => {
    // setNewStateParam();
    // console.debug(F, `Reset state`);

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={new QueryClient()}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </LocalizationProvider>
    </>
  );
}
