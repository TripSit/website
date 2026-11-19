# Indexing checks

The public site uses `https://tripsit.me` (or the build-time
`NEXT_PUBLIC_DNS_DOMAIN`) for canonical links and sitemap URLs. Factsheet
database names are canonical; aliases, display names and case variants redirect
permanently to those names. The factsheets directory includes server-rendered
links so discovery does not depend on the interactive table's JavaScript.
The appeal and 404 pages use `noindex`; the appeal also sends an HTTP
`X-Robots-Tag`. Keep these URLs out of the sitemap.

## After deployment

- Check that `/factsheets/LSD` and `/factsheets/acid` redirect to
  `/factsheets/lsd`, which returns 200 and declares itself canonical.
- Check that `/index.html` and `/index.php` redirect to `/` rather than the blog.
- Inspect the initial HTML of `/factsheets`: it should contain links to
  individual factsheets, including URL-encoded database names.
- Check `/appeal` for `noindex` in both its HTML and HTTP headers. Ensure the
  reverse proxy does not replace this with its global `X-Robots-Tag: all`.
- Confirm `/robots.txt` and `/sitemap.xml` return 200, the sitemap lists only
  canonical public URLs, and HTTP/www redirects retain the path and query.
- In Search Console, open the affected URL examples and compare the declared
  and Google-selected canonical. Inspect both URLs; the notification alone does
  not identify them. Request indexing for the intended canonical pages and use
  **Validate fix** after the deployed responses pass the checks above. Google
  must recrawl before the report can change; duplicate alias URLs should redirect
  rather than be independently indexed.

## Live audit, November 19, 2026

The live sitemap had 568 unique URLs. All its non-factsheet pages and a sample
of 13 individual factsheets (26 pages total) returned 200 with matching
self-referential canonical URLs. The factsheet directory had no individual
factsheet links in its initial HTML. These fixes are based on the current UAT
branch, preserving its calculator, legal and chart pages.

HTTPS, www, robots.txt and sitemap.xml worked. `/factsheets/LSD` returned 200
with `/factsheets/lsd` as canonical; `/appeal` allowed indexing; `/index.html`
redirected to the blog. The drugs/chat subdomains redirected to the appropriate
pages, with an extra trailing-slash normalization hop. Python's default user
agent received Cloudflare error 1010, while a browser user agent succeeded.
This alone does not establish that verified Googlebot is blocked. If Search
Console reports fetch failures, inspect Cloudflare events for verified crawlers
before changing bot rules.
