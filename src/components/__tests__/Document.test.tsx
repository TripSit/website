import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import Document from "@/pages/_document";
import RootLayout, { metadata } from "@/app/layout";
import BlogSuggestion from "../BlogSuggestion";
import Github from "../Github";
import Patreon from "../Patreon";

jest.mock("next/document", () => ({
  __esModule: true,
  default: class {},
  Html: ({ children }: { children: ReactNode }) => <html>{children}</html>,
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
  expect(html).toContain('rel="icon"');
  expect(html).toContain("Page content");
  expect(html).toContain("/next-runtime.js");
  expect(html).toContain("bootstrap.bundle.min.js");
});

test("renders the app layout with metadata and page content", () => {
  const html = renderToStaticMarkup(
    <RootLayout>
      <main>Hello</main>
    </RootLayout>,
  );
  expect(html).toContain('lang="en"');
  expect(html).toContain("<main>Hello</main>");
  expect(metadata.title).toBe("TripSit");
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
