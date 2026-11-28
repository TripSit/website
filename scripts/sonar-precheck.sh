#!/usr/bin/env bash
# Approximates the SonarScan quality gate locally. The Sonar server (Community Build) cannot analyze
# a branch or PR before merge, so this lints the files changed against uat with the Sonar-relevant
# ESLint rules promoted to errors. Run it before opening a PR: npm run sonar:precheck
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

BASE_REF="${SONAR_PRECHECK_BASE:-origin/uat}"
if ! git rev-parse --verify --quiet "$BASE_REF" >/dev/null; then
  echo "sonar-precheck: base ref $BASE_REF not found; run 'git fetch origin uat' first." >&2
  exit 1
fi
BASE="$(git merge-base "$BASE_REF" HEAD)"

# Committed, staged, unstaged and untracked source files, minus what sonar-project.properties excludes
# (tests under __tests__) and type declarations.
FILES="$(
  {
    git diff --name-only --diff-filter=d "$BASE"
    git ls-files --others --exclude-standard
  } | sort -u | grep -E '^src/.*\.(ts|tsx|js|jsx)$' \
    | grep -Ev '(/__tests__/|\.test\.[jt]sx?$|\.d\.ts$)' \
    || true
)"

if [ -z "$FILES" ]; then
  echo "sonar-precheck: no analyzable source files changed against $BASE_REF."
  exit 0
fi

echo "sonar-precheck: linting $(echo "$FILES" | wc -l) changed file(s) against $BASE_REF"
# shellcheck disable=SC2086
npx eslint \
  --rule '{"sonarjs/cognitive-complexity":["error",15],"sonarjs/no-duplicate-string":["error",{"threshold":3}],"sonarjs/no-nested-conditional":"error","@typescript-eslint/no-non-null-assertion":"error"}' \
  --quiet $FILES
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "" >&2
  echo "sonar-precheck: FAILED. Sonar's new-code gate would likely fail on these (S3776 cognitive complexity," >&2
  echo "S1192 duplicate strings, S3358 nested ternaries, non-null assertions). Fix them before opening the PR." >&2
  echo "Also check tests: a test whose only assertion is a negated expect(...) fails S2699; add a positive assertion." >&2
fi
exit $STATUS
