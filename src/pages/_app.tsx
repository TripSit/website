import { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import AOS from "aos";
// Vendor CSS Files
import "aos/dist/aos.css";
import "../../public/assets/vendor/bootstrap/css/bootstrap.min.css";
// Main CSS file
import "../../public/assets/css/style.css";
// Tailwind utilities (after style.css so utilities win the cascade)
import "../styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // note: this is TanStack React Query V5

export default function App({ Component, pageProps }: AppProps) {
  // One client for the whole session. Creating it during render would replace it (and empty
  // its cache) on every navigation, so drugs.json would be downloaded again on every page.
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
