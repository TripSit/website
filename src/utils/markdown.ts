import { readFileSync } from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";

// Raw HTML in the markdown is shown as text rather than rendered.
const markdown = new MarkdownIt({ html: false });

function slug(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");
}

// Give every heading an id from its text, so a section can be linked to
// (/terms#ban-appeals). A repeated heading gets -2, -3 and so on.
markdown.core.ruler.push("heading_ids", (state) => {
  const used = new Set<string>();
  for (const [index, token] of state.tokens.entries()) {
    if (token.type !== "heading_open") {
      continue;
    }
    const base = slug(state.tokens[index + 1].content);
    let id = base;
    let count = 1;
    while (used.has(id)) {
      count += 1;
      id = `${base}-${count}`;
    }
    used.add(id);
    token.attrSet("id", id);
  }
});

export function renderMarkdown(source: string): string {
  return markdown.render(source);
}

// Reads a page's text from src/content and turns it into HTML. Call it from
// getStaticProps, so this happens when the site is built and the markdown
// library never reaches the browser.
export function renderContent(file: string): string {
  return renderMarkdown(
    readFileSync(path.join(process.cwd(), "src", "content", file), "utf8"),
  );
}
