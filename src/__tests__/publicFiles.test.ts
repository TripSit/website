/**
 * @jest-environment node
 */
import { readdirSync } from "node:fs";
import path from "node:path";

const publicDir = path.join(__dirname, "../../public");

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesUnder(path.join(dir, entry.name))
      : [path.relative(publicDir, path.join(dir, entry.name))],
  );
}

test("public/ has no server-side scripts, which Next.js would serve as source", () => {
  const files = filesUnder(publicDir);
  expect(files).toContain("assets/img/favicon.png");
  expect(
    files.filter((file) => /\.(php|phtml|cgi|pl|py)$/i.test(file)),
  ).toEqual([]);
});
