/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: __dirname },
  // ponytail: @mui/x-date-pickers v8 is ESM-only en struikelt over MUI v6's
  // ontbrekende exports-map als het extern geresolved wordt; bundelen lost dat op.
  // Weghalen zodra MUI naar v7+ kan (geblokkeerd door material-react-table).
  transpilePackages: ["@mui/x-date-pickers"],
};

module.exports = nextConfig;
