<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Keep website and TripBot CI/CD aligned

When changing CI/CD in this repository, inspect the sibling `../tripbot` repository and apply the
same shared behavior changes there in the same task. This includes GitHub Actions workflows,
Drone pipelines, PR checks, UAT merge queues, test/coverage artifacts, SonarScan, and release policy.
Preserve each application's required Node version, install/build/test commands, generated clients,
Docker targets, and deployment settings. Repository-specific integrations (such as TripBot's Claude
and bounty workflows) may remain separate. Document intentional differences and validate both repos.
If the sibling repository is unavailable or cannot be edited, report the missing matching change
explicitly instead of claiming CI/CD parity.
