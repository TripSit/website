/**
 * @jest-environment node
 */
import { renderContent, renderMarkdown } from "@/utils/markdown";

describe("renderMarkdown", () => {
  it("gives each heading an id taken from its text", () => {
    expect(
      renderMarkdown("## Ban appeals\n\n### Personally-identifying *info*"),
    ).toBe(
      '<h2 id="ban-appeals">Ban appeals</h2>\n' +
        '<h3 id="personally-identifying-info">Personally-identifying <em>info</em></h3>\n',
    );
  });

  it("numbers repeated headings so every id stays unique", () => {
    const html = renderMarkdown("## Contact\n\n## Contact\n\n## Contact?");
    expect([...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => id)).toEqual([
      "contact",
      "contact-2",
      "contact-3",
    ]);
  });

  it("shows raw HTML as text instead of rendering it", () => {
    expect(renderMarkdown('<script>alert("x")</script>')).toBe(
      "<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>\n",
    );
  });

  it("renders links and nested ordered lists", () => {
    expect(renderMarkdown("1. Rule\n   1. [Appeal](/appeal)")).toBe(
      '<ol>\n<li>Rule\n<ol>\n<li><a href="/appeal">Appeal</a></li>\n</ol>\n</li>\n</ol>\n',
    );
  });
});

describe("renderContent", () => {
  it("reads a page's markdown from src/content", () => {
    const html = renderContent("terms.md");
    expect(html).toContain(
      '<h2 id="acceptance-of-terms">Acceptance of terms</h2>',
    );
    expect(html).toContain('<a href="/appeal">ban appeal form</a>');
  });
});
