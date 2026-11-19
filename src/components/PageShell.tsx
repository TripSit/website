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
  path,
  noindex,
  children,
}: Readonly<{
  title: string;
  description: string;
  // The page's path for its canonical link and link previews; see Head
  path?: string;
  noindex?: boolean;
  children: ReactNode;
}>) {
  return (
    <div
      data-bs-theme="dark"
      className={`${fontVariables} font-body text-ink antialiased`}
    >
      <Head
        title={title}
        description={description}
        path={path}
        noindex={noindex}
      />
      <Header />
      <main id="main" className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
