// This file is CommonJS, loaded by Node as-is, so it can't use `import`.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const blogPaths = require("./src/assets/blogPaths.json");

// Old articles moved from <domain>/<post> to the WordPress blog at updates.<domain>/<post>/.
// The blog no longer changes, so a fixed list (taken from its sitemap.xml, minus its home
// page and a test page) replaces the Cloudflare Worker that checked the blog on every miss.
// Redirects run before pages, so src/__tests__/blogRedirects.test.ts checks that no redirect
// below starts with a path this site serves.
const blogOrigin = `https://updates.${process.env.NEXT_PUBLIC_DNS_DOMAIN || "tripsit.me"}`;

// Send <path>, and anything under it such as a post's feed, to the same place on the blog.
// Blog URLs end in "/". Linking there directly skips the blog's own slash redirect, which
// points at an internal port (:8080) and never loads.
function toBlog(path, rest = ":rest*") {
  return {
    source: `${path}/${rest}`,
    destination: `${blogOrigin}${path}/${rest}/`,
    permanent: true,
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output traces each page's actual dependencies into
  // .next/standalone, so the production Docker image can run `node server.js`
  // without needing the full node_modules tree (or a second `npm ci`) copied in.
  output: "standalone",
  turbopack: { root: __dirname },
  // Don't advertise the framework in an x-powered-by header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/appeal",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        // Only this site may show its pages in a frame (clickjacking protection). The server's
        // proxy adds an X-Frame-Options value that browsers ignore; frame-ancestors overrides it.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy homepage addresses should consolidate on the homepage, not the blog.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/privacy", destination: "/tripbot/privacy", permanent: true },
      ...blogPaths.map((path) => toBlog(path)),
      // Not in the sitemap, but still linked from elsewhere: feed readers subscribed to the
      // old address, the blog's front-page pages, and images other sites embed from posts.
      toBlog("/feed"),
      toBlog("/comments", ":rest+"),
      toBlog("/page", ":rest+"),
      {
        source: "/wp-content/:path*",
        destination: `${blogOrigin}/wp-content/:path*`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
