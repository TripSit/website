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

// The first heading with a given id keeps it; repeats get -2, -3 and so on.
function uniqueId(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let count = 2;
  while (used.has(`${base}-${count}`)) count += 1;
  return `${base}-${count}`;
}

// Give every heading an id from its text, so a section can be linked to
// (/terms#ban-appeals).
markdown.core.ruler.push("heading_ids", (state) => {
  const used = new Set<string>();
  for (const [index, token] of state.tokens.entries()) {
    if (token.type !== "heading_open") {
      continue;
    }
    const id = uniqueId(slug(state.tokens[index + 1].content), used);
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
