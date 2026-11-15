import NextHead from "next/head";
import type { ReactNode } from "react";
import Footer from "./Footer";
import Head from "./Head";
import Header from "./Header";
import { fontVariables } from "./fonts";

// Shared chrome for Tailwind-styled content pages: header, footer, brand
// fonts and a per-page title. The fixed header is h-20, hence the pt-20.
export default function PageShell({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: ReactNode;
}>) {
  return (
    <div
      data-bs-theme="dark"
      className={`${fontVariables} font-body text-ink antialiased`}
    >
      <Head />
      {/* Rendered after <Head />: next/head keeps the last title and
          description it sees, so these override the site defaults */}
      <NextHead>
        <title>{title}</title>
        <meta name="description" content={description} />
      </NextHead>
      <Header />
      <main id="main" className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
