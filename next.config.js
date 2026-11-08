/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output traces each page's actual dependencies into
  // .next/standalone, so the production Docker image can run `node server.js`
  // without needing the full node_modules tree (or a second `npm ci`) copied in.
  output: "standalone",
  turbopack: { root: __dirname },
};

module.exports = nextConfig;
