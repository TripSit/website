import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import Document from "@/pages/_document";
import BlogSuggestion from "../BlogSuggestion";
import Github from "../Github";
import Patreon from "../Patreon";

jest.mock("next/document", () => ({
  __esModule: true,
  // The real Document is a React component class that _document.tsx extends.
  default: jest.requireActual("react").Component,
  Html: ({ children, lang }: { children: ReactNode; lang?: string }) => (
    <html lang={lang}>{children}</html>
  ),
  Head: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Main: () => <main>Page content</main>,
  NextScript: () => <output data-script-src="/next-runtime.js" />,
}));
jest.mock(
  "next/script",
  () =>
    function Script({ src }: { src: string }) {
      return <output data-script-src={src} />;
    },
);

test("renders the document shell, favicons and browser scripts", () => {
  const html = renderToStaticMarkup(Document.prototype.render());
  expect(html).toContain('<html lang="en">');
  expect(html).toContain('<link href="/assets/img/favicon.png" rel="icon"/>');
  expect(html).toContain("Page content");
  expect(html).toContain("/next-runtime.js");
  expect(html).toContain(
    'data-script-src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"',
  );
});

test("loads nothing from third-party hosts and no relative asset paths", () => {
  const html = renderToStaticMarkup(Document.prototype.render());
  const urls = [...html.matchAll(/(?:href|data-script-src)="([^"]*)"/g)].map(
    ([, url]) => url,
  );
  expect(urls).not.toHaveLength(0);
  // Relative paths 404 under /factsheets/<drug>; CDN scripts had no integrity hashes.
  for (const url of urls) {
    expect(url).toMatch(/^\/(?!\/)/);
  }
  expect(html).not.toContain("apple-touch-icon");
});

test("uses the blog root during server rendering", () => {
  expect(
    renderToStaticMarkup(
      <BlogSuggestion blogOrigin="https://blog.tripsit.me" />,
    ),
  ).toContain('href="https://blog.tripsit.me/"');
});

test("renders community support links", () => {
  expect(renderToStaticMarkup(<Github />)).toContain(
    'href="https://www.github.com/tripsit"',
  );
  expect(renderToStaticMarkup(<Patreon />)).toContain(
    'href="https://www.patreon.com/bePatron?u=899550"',
  );
});
