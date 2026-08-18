/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output traces each page's actual dependencies into
  // .next/standalone, so the production Docker image can run `node server.js`
  // without needing the full node_modules tree (or a second `npm ci`) copied in.
  output: "standalone",
  turbopack: { root: __dirname },
  // ponytail: @mui/x-date-pickers v8 is ESM-only en struikelt over MUI v6's
  // ontbrekende exports-map als het extern geresolved wordt; bundelen lost dat op.
  // Weghalen zodra MUI naar v7+ kan (geblokkeerd door material-react-table).
  transpilePackages: ["@mui/x-date-pickers"],
};

module.exports = nextConfig;
