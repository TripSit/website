/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output traces each page's actual dependencies into
  // .next/standalone, so the production Docker image can run `node server.js`
  // without needing the full node_modules tree (or a second `npm ci`) copied in.
  output: "standalone",
  turbopack: { root: __dirname },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
