import type { NextConfig } from "next";

const nextConfig = require("../../../next.config.js") as NextConfig;

describe("clickjacking response headers", () => {
  it("sends an enforceable framing policy on every route", async () => {
    const rules = await nextConfig.headers?.();
    const everyRoute = rules?.find((rule) => rule.source === "/(.*)");
    const headers = Object.fromEntries(
      (everyRoute?.headers ?? []).map(({ key, value }) => [key.toLowerCase(), value]),
    );

    expect(headers["content-security-policy"]).toContain("frame-ancestors 'self'");
    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("omits the Next.js version disclosure header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
