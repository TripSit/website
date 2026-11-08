# Contributing to the TripSit website

Thanks for your interest in contributing! This file covers contribution mechanics; see [README.md](README.md) for
project setup and local development.

## Getting started

1. [Join our Discord guild](https://discord.gg/tripsit) — development discussion happens there.
2. Follow the **Development - Getting Started** section in [README.md](README.md) to get a local instance running.

## Finding and claiming work

All work is tracked in [GitHub issues](https://github.com/TripSit/website/issues).

- **Find something to do.** Filter by `Status: Available`. `good first issue` marks small, well-scoped ones.
- **Claim it before you start.** Assign yourself and change the status label to `Status: In Progress`. If you stop,
  unassign yourself and set it back to `Status: Available`.
- **Mind the area.** Issues with the same `Area:` label usually touch the same files. If one in your area is already
  `Status: In Progress`, coordinate with its assignee or wait for it to merge. Issues labelled `dependencies` change
  `package.json` or `package-lock.json`, so land them one at a time.
- **Link your work.** Put the issue number in the branch name (`fix/268-oidc-pkce`) and write `Closes #268` in the
  pull request, so the issue closes when the PR merges into `uat`.
- **Old review IDs.** Issues moved from the old review tracker keep their ID in the title, for example `(WEB-006)`.
  Older branches, commits and PRs refer to them by that ID.

New issues from the templates start as `Status: Pending` with a `Type:` label. Triage gives them a priority and an
area, and moves them to `Status: Available` or `Status: Needs Decision`.

## Labels

Every issue gets one label from each group:

| Group       | Labels                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Priority:` | `Critical` (P0, fix now) · `High` (P1, real bug or exposure) · `Medium` (P2, should fix) · `Low` (P3, polish)           |
| `Type:`     | `Bug` · `Enhancement` · `Maintenance` (cleanup, tooling, CI/CD, deploy, dependencies, docs) · `Question`                |
| `Status:`   | `Pending` (needs triage or confirmation) · `Available` · `Needs Decision` · `Blocked` · `In Progress` · `Review Needed` |
| `Area:`     | `Factsheets` · `Homepage` · `Auth` · `UI` · `Forms` · `Tools` · `Content` · `CI` · `Deploy` · `Repo`                    |

Add any tags that apply: `security`, `performance`, `accessibility`, `mobile`, `seo`, `dependencies`,
`good first issue`, `help wanted`. Each label's description on GitHub says what it covers. Close finished issues
rather than leaving them on `Status: Completed`. Use `duplicate` or `wontfix` when closing an issue that won't be
worked on.

## Branching and pull requests

- `main` is the production branch. `uat` is the staging/integration branch.
- Feature branches are created from `uat` and opened as pull requests **into `uat`**, not `main`. A GitHub Action
  (`GuardMainSource`) enforces that only `uat` may open a pull request into `main`.
- Before opening a pull request, pull the latest `uat` into your feature branch first so it's up to date and the
  push won't be rejected as non-fast-forward. Prefer branching fresh from `uat` over rebasing an existing
  shared/pushed branch, since rewriting history on a branch others may have pulled is riskier.
- Keep commits focused and use the repository's concise, imperative commit message style (see `git log` for
  examples).
- Do not force-push shared branches or use destructive Git commands to "clean up" a branch.

## Running checks before opening a PR

Every pull request into `main` or `uat` runs lint, tests, a production build (which includes a full TypeScript
check), and CodeQL. Run the equivalent checks locally first:

```bash
# Install dependencies (matches CI)
npm ci

# Lint
npx eslint .

# Tests
npm test

# Production build (also type-checks)
npx next build
```

Committing runs `lint-staged` automatically via Husky, which lints and fixes your staged files. `npm ci` runs
Husky's `prepare` script, which sets `core.hooksPath`; use `npm ci --ignore-scripts` if you don't want that.

## Scope and safety

- Keep pull requests scoped to the problem they solve — avoid unrelated refactors, formatting, or drive-by renames.
- Treat changes to drug information, dosage text, crisis resources, and privacy/legal pages as high-impact: preserve
  established wording and data sources.
- Never commit `.env`, tokens, passwords, or private URLs.
