/**
 * @jest-environment node
 */
import nextConfig from "../../next.config.js";

describe("security headers", () => {
  it("only lets this site frame its pages", async () => {
    expect(await nextConfig.headers?.()).toEqual([
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ]);
  });

  it("doesn't send an x-powered-by header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
