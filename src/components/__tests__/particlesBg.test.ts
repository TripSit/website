/** @jest-environment node */
import path from "node:path";

// Particles.tsx slows some effects by setting Proton.DEFAULT_INTERVAL (#7). That only reaches
// the animations if the site and particles-bg load the same proton-engine. If proton-engine
// were bumped past the major particles-bg accepts, npm would give particles-bg its own copy.
test("the site and particles-bg share one proton-engine", () => {
  const forSite = require.resolve("proton-engine");
  const forParticlesBg = require.resolve("proton-engine", {
    paths: [path.dirname(require.resolve("particles-bg/package.json"))],
  });
  expect(forParticlesBg).toBe(forSite);
});
