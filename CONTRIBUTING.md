# Contributing to the TripSit website

Thanks for your interest in contributing! This file covers contribution mechanics; see [README.md](README.md) for
project setup and local development.

## Getting started

1. [Join our Discord guild](https://discord.gg/tripsit) — development discussion happens there.
2. Follow the **Development - Getting Started** section in [README.md](README.md) to get a local instance running.

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

Every pull request into `main` or `uat` runs lint, a production build (which includes a full TypeScript check),
and CodeQL. Run the equivalent checks locally first:

```bash
# Install dependencies (matches CI)
npm ci

# Lint
npx eslint .

# Production build (also type-checks)
npx next build
```

Committing runs `lint-staged` automatically via Husky, which lints and fixes your staged files.

## Scope and safety

- Keep pull requests scoped to the problem they solve — avoid unrelated refactors, formatting, or drive-by renames.
- Treat changes to drug information, dosage text, crisis resources, and privacy/legal pages as high-impact: preserve
  established wording and data sources.
- Never commit `.env`, tokens, passwords, or private URLs.
