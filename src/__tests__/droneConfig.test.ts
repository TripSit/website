/**
 * @jest-environment node
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(__dirname, "../..");

// drone.tripsit.me reads .drone.yml and drone.tripsit.io reads .drone-uat.yml. Both servers
// receive every push, and Drone creates a build for any pipeline whose branch and event match
// before it checks `trigger: instance`. A pipeline for the other server's branch left builds
// there that never ran (#287).
describe.each([
  [".drone.yml", "main", "uat"],
  [".drone-uat.yml", "uat", "main"],
])("%s", (file, branch, otherBranch) => {
  const config = readFileSync(path.join(repoRoot, file), "utf8");

  it(`holds one pipeline that triggers on ${branch} only`, () => {
    expect(config).not.toContain("\n---\n");
    expect(config).toContain(`trigger:\n  branch:\n  - ${branch}\n`);
    expect(config).not.toContain(`  - ${otherBranch}\n`);
  });
});
