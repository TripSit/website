# Review issues

Shared tracker for problems found in a full review of `uat` at `a828e1e` on 2026-11-07.
It is written so that several agents (or people) can pick up issues in parallel without
stepping on each other. Read the next section before starting work.

## How to work from this file

- **IDs are stable.** Use the issue ID in branch names (`fix/WEB-007-query-client`), commit
  messages and PR titles. Never renumber; add new issues at the end with the next free ID.
- **Claim before you start.** Change only the `Status:` line of the issue you take, to
  `in-progress — <agent or person>, <branch>`. When done, set it to `fixed — <branch or PR>`.
  Other values: `open`, `wontfix — <reason>`, `needs-decision — <question>`.
- **Edit only your own issue's block** (its `Status:` line and an optional `Notes:` line).
  Status is deliberately kept out of the index table so parallel branches merge cleanly.
- **Respect the overlap groups below.** Issues in the same group touch the same files; one
  agent should take the whole group, or do them one after another.
- **Branch from `uat`, open PRs into `uat`** (see `CONTRIBUTING.md` and `CICD-POLICY.md`).
- **Do not use `git add -A`, `git add .` or `git commit -a` on a branch without #248
  (WEB-004).** On those branches it would strip bytes from 11 binary font files and corrupt
  them, so stage paths explicitly. Branches cut from `uat` after #248 merges are safe.
- **Check your work with:** `npx eslint .`, `npm test`, `npx next build`. Install with
  `npm ci --ignore-scripts` if you don't want husky's `prepare` script to set `core.hooksPath`.

Priorities: **P0** exploitable or critical, fix now · **P1** real bug or exposure, fix soon ·
**P2** CI/CD and deploy hardening · **P3** cleanup and polish.

## Index

| ID      | Pri | Area           | Title                                                                                      |
| ------- | --- | -------------- | ------------------------------------------------------------------------------------------ |
| WEB-001 | P0  | deps           | Next.js 16.3.1 has critical RCE advisories; axios, follow-redirects, sharp also vulnerable |
| WEB-002 | P0  | security       | 404 page fetches and redirects to the `Referer` header (SSRF + open redirect)              |
| WEB-003 | P0  | security, perf | Homepage embeds the full Discord guild object and calls Discord on every request           |
| WEB-004 | P1  | repo           | `.gitattributes` treats fonts as text; committing the working tree corrupts them           |
| WEB-005 | P1  | auth           | Logout deletes the ID token before building the Keycloak logout URL                        |
| WEB-006 | P1  | auth           | OIDC login has no `state` or PKCE                                                          |
| WEB-007 | P1  | perf           | `QueryClient` is recreated on every render, so the cache never survives                    |
| WEB-008 | P1  | frontend       | `_document.tsx` loads dead, duplicate and broken template scripts                          |
| WEB-009 | P1  | hygiene        | `public/forms/contact.php` is served as plain text; dead template code                     |
| WEB-010 | P1  | SEO, UX        | Factsheet detail pages are client-only and show "not found" while loading                  |
| WEB-011 | P1  | SEO            | `static/sitemap.xml` is never served; no `robots.txt`                                      |
| WEB-012 | P2  | CI             | Docker Build doesn't run on PRs, although the policy requires it                           |
| WEB-013 | P2  | CI             | Actions aren't SHA-pinned; Sonar runs from `@master`; workflows lack `permissions:`        |
| WEB-014 | P2  | deploy         | UAT Drone pipeline: missing compose file, Docker access with all secrets, unpinned image   |
| WEB-015 | P2  | CI             | `PromoteUatToMain` doesn't verify the approved commit; uses a PAT                          |
| WEB-016 | P2  | build          | Node version differs between CI (`.nvmrc`) and the Docker image                            |
| WEB-017 | P3  | CI             | `OpenUatToMainPR` swallows every error from `gh pr create`                                 |
| WEB-018 | P3  | docker         | Dev image runs as root; `.env` isn't in `.dockerignore`                                    |
| WEB-019 | P3  | cleanup        | Unused code and types                                                                      |
| WEB-020 | P3  | bug            | `Counter` and `Ghost` leak or churn event listeners                                        |
| WEB-021 | P3  | content        | Homepage stats are hard-coded                                                              |
| WEB-022 | P3  | a11y           | `<Html>` has no `lang` attribute                                                           |
| WEB-023 | P3  | docs           | README typos, Windows-only `dev` script, odd `engines` range, Dutch comment                |
| WEB-024 | P3  | perf           | Five UI/CSS systems and four icon sets ship together                                       |
| WEB-025 | P3  | lint           | Two `react-hooks/set-state-in-effect` warnings                                             |
| WEB-026 | P3  | deps           | Dev-only advisories remain (brace-expansion, js-yaml, zod)                                 |

### Overlap groups (same files; take together or in sequence)

- **Lockfile:** WEB-001 first, then anything else that changes `package.json` or
  `package-lock.json` (WEB-016, WEB-019, WEB-024, WEB-026).
- **Template scripts:** WEB-008, WEB-009, WEB-022 (`_document.tsx`, `_app.tsx`, `public/assets/vendor`).
- **Drug data:** WEB-007, WEB-010 (`_app.tsx`, `Factsheets.tsx`, `factsheets/[drug].tsx`).
- **Auth:** WEB-005, WEB-006, WEB-025 (`keycloak.ts`, `ProfileButton.tsx`, `appeal.tsx`).
- **Homepage:** WEB-003, WEB-020, WEB-021 (`pages/index.tsx`, `Counter.tsx`, `Ghost.tsx`).
- **Workflows:** WEB-012, WEB-013, WEB-015, WEB-017 (`.github/workflows/`).
- **Docker/Drone:** WEB-014, WEB-016, WEB-018 (`.drone.yml`, `Dockerfile`, `.dockerignore`).

---

## Issues

### WEB-001 — Next.js 16.3.1 has critical RCE advisories; other deps vulnerable

- Priority: P0 · Area: deps
- Status: fixed — fix/review-top-three (#247)
- Notes: `next` and `eslint-config-next` 16.4.5; `npm update` of axios 1.21.0,
  follow-redirects 1.16.2, sharp 0.35.5, source-map-js 1.2.2. Production audit now shows
  only 53 low findings. Remaining dev-only advisories are tracked in WEB-026.
- Files: `package.json`, `package-lock.json`

**Problem.** The lockfile pins `next@16.3.1`. `npm audit --omit=dev` reports 1 critical and
4 high: `next`, `axios` (≤1.19.0), `follow-redirects` (1.16.0–1.16.1), `sharp` (≤0.35.5-rc.1)
and `source-map-js` (1.0.0–1.2.1). The Next.js advisories include unauthenticated RCE in the
image optimizer (GHSA-2xp9-vwfh-vxw4, GHSA-2464-fhr4-w9xw), SSRF in the image optimizer
(GHSA-cjq9-62q9-8jv4) and ISR cache poisoning (GHSA-4jqv-mc3x-m676, GHSA-mcj8-r9mp-w47p).
The site uses `next/image`, so `/_next/image` is live in production.

**Fix.** Bump `next` and `eslint-config-next` to `^16.4.5`, then `npm audit fix` (no `--force`).
Check whether Dependabot security updates are enabled; no PR was opened for these.

**Done when.** `npm audit --omit=dev` shows no critical or high findings; lint, tests and build pass.

### WEB-002 — 404 page fetches and redirects to the `Referer` header

- Priority: P0 · Area: security
- Status: fixed — fix/review-top-three (#247)
- Notes: the page no longer reads headers, fetches or redirects, and is now static.
  `src/components/BlogSuggestion.tsx` links to `https://blog.<domain><path>` (the server
  HTML links to the blog root; the browser fills in the path). Tests:
  `src/app/__tests__/not-found.test.tsx`. Re-ran the curl repro: `404`, listener got 0 requests.
- Files: `src/app/not-found.tsx`

**Problem.** For any unmatched URL, `not-found.tsx` reads the `Referer` request header, which
the client controls, replaces `https://` with `https://blog.`, fetches the result from the
server and, if it answers 2xx, sends a 308 to it. URLs starting with `http://` are fetched
unchanged. That is server-side request forgery (the server will request internal addresses
and reveal whether they respond) and an open redirect. The fetch has no timeout.

It also never did what it was meant to. The goal (commit `d6e81ce`) was to send old article
URLs like `tripsit.me/<post>` to `blog.tripsit.me/<post>`, but `Referer` is the page the
visitor came _from_, not the URL they requested.

**Evidence.** Local repro: `curl -H "Referer: http://127.0.0.1:8765/" http://127.0.0.1:3123/does-not-exist`
returned `308` with `location: http://127.0.0.1:8765/`, and the listener on port 8765 logged
a request from the Next server.

**Fix.** Remove the server-side fetch and redirect. Show a link to the blog built from a fixed
host plus the requested path, computed in the browser. If automatic redirects for old article
URLs are still wanted, configure them in Traefik for a known list of paths.

**Done when.** The curl above returns `404` and the listener receives nothing.

### WEB-003 — Homepage embeds the full Discord guild object; calls Discord on every request

- Priority: P0 · Area: security, perf
- Status: fixed — fix/review-top-three (#247)
- Notes: `src/utils/discordStats.ts` returns `{ memberCount, presenceCount } | null`; the
  homepage uses `getStaticProps` with `revalidate: 300` (30 when the fetch fails). Build shows
  `/` as ISR. Local HTML props are `{"discord":null}` (no token locally). Tests:
  `src/utils/__tests__/discordStats.test.ts`.
- Files: `src/pages/index.tsx`

**Problem.** `getServerSideProps` returns the whole `APIGuild` response as page props, so every
homepage HTML response carries it in `__NEXT_DATA__`: role names and permissions, emojis,
channel IDs and more. Only two numbers are used. It also calls the Discord API with the bot
token on every page view, uncached, adding up to 3 s of latency and risking rate limits. With
no token configured it still sends `Authorization: Bot undefined`.

**Fix.** Fetch only `approximate_member_count` and `approximate_presence_count`, skip the call
when no token is set, and switch to `getStaticProps` with `revalidate` so Discord is called at
most every few minutes. Optional follow-up (needs decision): use the public invite endpoint
`GET /api/v10/invites/tripsit?with_counts=true`, which returns the same counts with no bot token.

**Deploy note.** `DISCORD_CLIENT_TOKEN` must be in the production _runtime_ environment, as it
already had to be. If it is missing at build time the page is built with zero counts and
regenerated on the first request after 30 s.

**Done when.** Homepage HTML contains only the two counts; the page is ISR, not per-request SSR.

### WEB-004 — `.gitattributes` treats fonts as text

- Priority: P1 · Area: repo
- Status: fixed — fix/gitattributes-binaries (#248)
- Notes: `* text=auto eol=lf` plus `binary` for png, jpg, jpeg, gif, ico, webp, pdf, ttf, otf,
  woff, woff2 and eot. A fresh clone now shows 0 modified files. The 6 CRLF vendor files are
  left as committed; renormalizing them (or deleting them via WEB-008/WEB-009) is optional.
- Files: `.gitattributes`

**Problem.** `* text eol=lf` applies to every file and only `*.png` is marked binary. Git
therefore plans to strip CR bytes from `.ttf`, `.woff`, `.woff2` and `.eot` files. That is why
`git status` shows 17 modified files nobody edited: 11 fonts under `public/assets/` and 6 text
files committed with CRLF. Committing them corrupts the fonts. `.otf`, `.jpg` and `.ico` are
also unprotected.

**Fix.** Add `binary` rules for `*.ttf *.otf *.woff *.woff2 *.eot *.jpg *.jpeg *.gif *.ico *.webp`
(or switch to `* text=auto eol=lf` plus those rules). The fonts then stop showing as modified.
Commit the 6 text files' CRLF→LF normalization on purpose, or delete them via WEB-008/WEB-009.

**Done when.** `git status` on a clean checkout lists no font files.

### WEB-005 — Logout deletes the ID token before building the logout URL

- Priority: P1 · Area: auth
- Status: open
- Files: `src/components/ProfileButton.tsx:101`, `src/utils/keycloak.ts:26`

**Problem.** `handleLogout` removes `kc_id_token` from `sessionStorage`, then calls
`getPostLogoutUrl()`, which reads it. Keycloak always receives an empty `id_token_hint`, so it
may show a confirmation page or reject `post_logout_redirect_uri`. Separately, the button
treats a `kc_token` in `localStorage` as logged in, but logout only clears `sessionStorage`.

**Fix.** Build the logout URL first, then clear tokens. Read and clear tokens from one storage
only. Consider also sending `client_id`.

### WEB-006 — OIDC login has no `state` or PKCE

- Priority: P1 · Area: auth
- Status: open
- Files: `src/utils/keycloak.ts:15`, `src/pages/appeal.tsx:125`, `src/pages/appeal.tsx:392`
- Needs: matching change in the API behind `/api/v2/keycloak/token` (not in this repo)

**Problem.** The authorization request sends no `state` and no `code_challenge`, and
`/appeal?code=…` exchanges any code it is given. An attacker can log a victim in as the
attacker's account (login CSRF). Tokens live in `sessionStorage`, so any XSS can read them.
The avatar URL from the API is put into a CSS `url()` unescaped (`ProfileButton.tsx:142`).

**Fix.** Generate a random `state` and a PKCE verifier (base64url from
`crypto.getRandomValues`; `randomString.ts` is not suitable, it emits characters PKCE forbids),
store both in `sessionStorage`, send `state` + S256 `code_challenge`, verify `state` on return
and pass `code_verifier` to the token endpoint. Quote and validate the avatar URL.

### WEB-007 — `QueryClient` recreated on every render

- Priority: P1 · Area: perf
- Status: open
- Files: `src/pages/_app.tsx:48`, `src/components/Factsheets.tsx:418`

**Problem.** `<QueryClientProvider client={new QueryClient()}>` builds a new client each time
`App` renders, which is every navigation, so the query cache is always empty and the 1 MB+
`drugs.json` is downloaded again. `Factsheets.tsx` wraps itself in a second `QueryClient`
and a second `LocalizationProvider`.

**Fix.** `const [queryClient] = useState(() => new QueryClient())` in `_app.tsx`; delete the
`ExamplePage` wrapper in `Factsheets.tsx`; give the drugs query a `staleTime`.

### WEB-008 — `_document.tsx` loads dead, duplicate and broken template scripts

- Priority: P1 · Area: frontend
- Status: open
- Files: `src/pages/_document.tsx`, `src/pages/_app.tsx:6-16`, `public/assets/js/main.js`, `public/assets/vendor/`

**Problem.** Leftovers from the BootstrapMade "OnePage" template:

- Script and favicon paths are relative (`assets/...`), so they 404 under `/factsheets/<drug>`.
- `apple-touch-icon.png` doesn't exist.
- AOS loads three times (npm import, vendor file, unpkg) and its CSS twice.
- Swiper v10 element bundle comes from jsDelivr while the npm package is v14; old vendor
  Swiper CSS is also imported.
- CDN scripts load without integrity hashes.
- `main.js` waits for `DOMContentLoaded`, which has fired before Next loads it, so it never runs.
  Nothing in the React tree matches its selectors anyway.
- Nothing uses glightbox, isotope or `php-email-form/validate.js`.

**Keep:** `bootstrap.bundle.min.js` is still needed for the collapse at `appeal.tsx:774`
(`data-bs-toggle="collapse"`); fix its path to `/assets/...` or replace the collapse.

**Fix.** Remove the dead scripts and their CSS imports, use absolute paths, and drop the
`apple-touch-icon` link or add the file.

### WEB-009 — `contact.php` served as plain text; dead template code

- Priority: P1 · Area: hygiene
- Status: open
- Files: `public/forms/`, `public/assets/vendor/php-email-form/`

**Problem.** Next.js doesn't execute PHP, so `/forms/contact.php` is served as source. It is
template code that requires a library that doesn't exist.

**Fix.** Delete `public/forms/` and `public/assets/vendor/php-email-form/` (after removing the
script tag in WEB-008).

### WEB-010 — Factsheet detail pages are client-only

- Priority: P1 · Area: SEO, UX
- Status: open
- Files: `src/pages/factsheets/[drug].tsx`

**Problem.** The page downloads the full `drugs.json` from `raw.githubusercontent.com` in the
browser on each visit. Until it arrives (and on the first render, before `router.query` is
populated) it shows "Drug not found, not JavaScript is not enabled." The error states render
without the header. Search engines get no content. Alias matching lowercases the query but
not the aliases.

**Fix.** `getStaticPaths` + `getStaticProps` from the `tripsit_drug_db` package (already a
dependency) or a build-time fetch with `revalidate`. Add a loading state, fix the message,
render the header on errors, and compare aliases case-insensitively.

### WEB-011 — Sitemap is never served; no `robots.txt`

- Priority: P1 · Area: SEO
- Status: open
- Files: `static/sitemap.xml`, `Dockerfile` (copies `static/`)

**Problem.** Next.js stopped serving `static/` years ago; only `public/` is served. The sitemap
is also dated 2024 and lacks `/combo` and the factsheet pages. There is no `robots.txt`.

**Fix.** Generate the sitemap (for example `pages/sitemap.xml.ts`, including factsheet pages)
or move it to `public/`, add `public/robots.txt`, and drop `static/` from the Dockerfile.

### WEB-012 — Docker Build doesn't run on PRs

- Priority: P2 · Area: CI
- Status: open
- Files: `.github/workflows/PullRequestOpenAll.yml`

**Problem.** `CICD-POLICY.md` §2 requires "Docker Build" on UAT PRs, but the job only exists
in `PushToUat.yml` and `PushToMain.yml`, so a broken Dockerfile is found after merging.

**Fix.** Add the `docker-build` job to `PullRequestOpenAll.yml` with the same name that branch
rules require.

### WEB-013 — Actions not pinned; Sonar from `@master`; missing `permissions:`

- Priority: P2 · Area: CI
- Status: open
- Files: `.github/workflows/*.yml`

**Problem.** Third-party actions use moving tags (`@v4`, `@v3`), and
`sonarsource/sonarqube-scan-action@master` (`PushToUat.yml:87`, `PushToMain.yml:56`) gets
`SONAR_TOKEN` from a branch the vendor can move at any time. `PushToMain.yml` and
`PushToUat.yml` have no `permissions:` block, so they get the repository's default token
permissions. `CICD-POLICY.md` asks for SHA pins and read-only defaults.

**Fix.** Pin every action to a full commit SHA with a version comment (as `GuardMainSource.yml`
does), add `permissions: contents: read` at the top of every workflow, and grant more per job.

### WEB-014 — UAT Drone pipeline problems

- Priority: P2 · Area: deploy
- Status: open
- Files: `.drone.yml:72-125`

**Problem.**

- Line 94 runs `docker compose -f docker-compose.website-prod.yml`, a file that has never been
  in this repository. Either the runner supplies it (undocumented) or UAT deploys fail.
- The pipeline still has `DOCKER_HOST` access plus every runtime secret, the model production
  moved away from in `4e3af44`. Anything merged into `uat` runs with that access.
- `appleboy/drone-discord` (line 121) is unpinned; production pins it by digest.
- `REDDIT_*` and `DISCORD_CLIENT_ID` are passed in but nothing in `src/` reads them.

**Fix.** Confirm where the compose file comes from; move UAT to the signed-hook model; pin the
image; drop unused secrets.

### WEB-015 — `PromoteUatToMain` hardening

- Priority: P2 · Area: CI
- Status: open
- Files: `.github/workflows/PromoteUatToMain.yml`

**Problem.**

- It moves `main` to `github.event.pull_request.head.sha` without checking that it equals the
  approved commit (`github.event.review.commit_id`) and the PR's current head. The wait loop
  checks the merge state of whatever the head is _now_.
- It accepts `UNSTABLE` (non-required checks failing).
- It uses a personal access token; `CICD-POLICY.md` §5 calls for a dedicated GitHub App.
- No `concurrency:` group, so two approvals can race.
- The `if:` doesn't check that the head repo is this repo (a fork without secrets fails, but
  fail early).

**Fix.** Re-read the PR right before the PATCH and require
`review.commit_id == event head SHA == current head SHA`; decide on `UNSTABLE`; add
`concurrency: { group: promote-main, cancel-in-progress: false }`; plan the App migration.

### WEB-016 — Node version drift

- Priority: P2 · Area: build
- Status: open
- Files: `.nvmrc`, `Dockerfile`, `package.json`

**Problem.** CI uses `.nvmrc` (`v22.14.0`). The Dockerfile uses `node:lts-alpine`, which floats
and now resolves to a newer major. Production therefore runs a Node version CI never tested.
`@types/node` is on major 26.

**Fix.** Pick one major, pin the Docker tag to it (for example `node:22-alpine`), and align
`.nvmrc` and `@types/node`.

### WEB-017 — `OpenUatToMainPR` swallows errors

- Priority: P3 · Area: CI
- Status: open
- Files: `.github/workflows/OpenUatToMainPR.yml:31`

**Problem.** `gh pr create … || echo "No PR created"` hides authentication and API failures as
well as the expected "no diff" case.

**Fix.** Check for a diff first (`gh api repos/{owner}/{repo}/compare/main...uat`) and let real
errors fail the job.

### WEB-018 — Dev image runs as root; `.env` not ignored

- Priority: P3 · Area: docker
- Status: open
- Files: `Dockerfile:30`, `.dockerignore`

**Problem.** `USER node` is commented out in the development stage. `.dockerignore` doesn't
exclude `.env` or `.env*.local`, so local secrets are copied into the build-stage layers.

**Fix.** Add `.env` and `.env*.local` to `.dockerignore`; run the dev stage as `node`.

### WEB-019 — Unused code and types

- Priority: P3 · Area: cleanup
- Status: open
- Files: listed below

**Problem.** Not imported anywhere (verify before deleting):

- `src/components/DiscordMembers.tsx`. It also reads `process.env.DISCORD_CLIENT_TOKEN` in the
  browser, where it is always `undefined`.
- `src/utils/env.config.ts`, which assigns secrets to a global.
- `src/utils/randomString.ts` and `src/utils/queryString.ts`; only their tests import them.
- `src/types/database.d.ts`, generated types nothing imports.
- `debugDrug` in `src/pages/factsheets/[drug].tsx:18` and large commented-out blocks in `_app.tsx`.

**Fix.** Delete them (and their tests), or wire them up if planned.

### WEB-020 — `Counter` and `Ghost` listener problems

- Priority: P3 · Area: bug
- Status: open
- Files: `src/components/Counter.tsx:41`, `src/components/Ghost.tsx:7`

**Problem.** `Counter`'s effect has no dependency array and no cleanup, so it adds another
`aos:in` listener on every render. `Ghost` lists `lastActivity` and `timeoutId` as
dependencies, so it removes and re-adds its listeners on every mouse move, and the last
timer isn't cleared on unmount.

**Fix.** Keep the timer and timestamp in refs and subscribe once; add cleanup to `Counter`.

### WEB-021 — Hard-coded homepage stats

- Priority: P3 · Area: content
- Status: open
- Files: `src/pages/index.tsx:300`

**Problem.** "Drugs in our Database" is fixed at 780 and "Subreddit Subscribers" at 57,468.

**Fix.** Count drugs from `tripsit_drug_db` at build time; fetch the subreddit count in
`getStaticProps` (after WEB-003) or remove it.

### WEB-022 — `<Html>` has no `lang`

- Priority: P3 · Area: a11y
- Status: open
- Files: `src/pages/_document.tsx:8`

**Fix.** `<Html lang="en">`.

### WEB-023 — README, scripts and config nits

- Priority: P3 · Area: docs
- Status: open
- Files: `README.md`, `package.json`, `next.config.js`

**Problem.**

- README lines 3–7 are garbled ("I. I. ## Table of Contents", "----", "---!") and there is a
  `[!WARNKNG]` callout.
- `"dev"` uses Windows `set` syntax; `".dev"` is the Unix one. There's no `build` script.
- `engines.node` is `>=23.9.0 || >=22.14.0`, which just means `>=22.14.0`.
- The `transpilePackages` comment in `next.config.js` is in Dutch.

**Fix.** Tidy the README; use `cross-env` or one script; add `build`; simplify `engines`;
translate the comment.

### WEB-024 — Too many UI systems

- Priority: P3 · Area: perf
- Status: needs-decision — which component system to standardise on
- Files: `package.json`, `src/pages/_app.tsx`

**Problem.** Bootstrap CSS and JS, MUI with Emotion, HeroUI and Tailwind all ship, plus four
icon sets (bootstrap-icons, boxicons, remixicon, MUI icons). Dependabot has open major-version
PRs for MUI 9, HeroUI 3 and TypeScript 7; MUI is held back by `material-react-table` (see
`next.config.js`).

**Fix.** Choose one system, migrate, and measure with `@next/bundle-analyzer`.

### WEB-025 — Lint warnings

- Priority: P3 · Area: lint
- Status: open
- Files: `src/components/ProfileButton.tsx:78`, `src/pages/appeal.tsx:445`

**Problem.** `react-hooks/set-state-in-effect` warns at both places (the rule is set to `warn`
in `eslint.config.mjs` as known debt).

**Fix.** Refactor (derive state, or move the work into event handlers) and raise the rule to
`error`.

### WEB-026 — Dev-only advisories remain

- Priority: P3 · Area: deps
- Status: open
- Files: `package-lock.json`

**Problem.** After WEB-001, full `npm audit` still reports 3 high and 19 moderate advisories,
all in dev tooling that never ships: `brace-expansion`, `js-yaml` and `zod` (denial-of-service
class), plus the `minimatch` chain under eslint and jest. `npm audit fix` resolves them, but it
also moves jest to 30.5, typescript-eslint to 8.72 and nests many packages. That's too much
churn for the security PR, so it was left out.

**Fix.** In a separate PR, run `npm audit fix` (no `--force`), then lint, test and build.
Belongs to the lockfile overlap group.
