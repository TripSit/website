import { AppProps } from "next/app";
import { useEffect } from "react";
import AOS from 'aos';
import '../../public/assets/vendor/aos/aos.css';

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    AOS.init();
  }, [])
  

  return <Component {...pageProps} />
}