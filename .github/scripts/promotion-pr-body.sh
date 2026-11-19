#!/usr/bin/env bash
# Prints the body of the "Promote uat to main" PR: the pull requests merged into uat that main
# doesn't have yet, oldest first. OpenUatToMainPR.yml rewrites the PR body with it on every push
# to uat, so the PR always describes what approving it would release.
#
# uat takes merge commits, so uat's first-parent history since main has one commit per merged
# PR (several for a rebase merge) plus anything pushed to uat directly. Each of those commits is
# matched to the PR that merged it; the feature branches' own commits stay out of the list.
#
# Needs the full history of origin/main and origin/uat (checkout with fetch-depth: 0), GH_REPO
# set to owner/name, and gh authenticated with read access to the repository's pull requests.
# To try it locally: git fetch origin && GH_REPO=TripSit/website .github/scripts/promotion-pr-body.sh
set -euo pipefail

: "${GH_REPO:?Set GH_REPO to owner/name}"
base_sha=$(git rev-parse origin/main)
head_sha=$(git rev-parse origin/uat)
commit_count=$(git rev-list --count "$base_sha..$head_sha")

# Wrap @handles (as in Dependabot titles like "Bump @types/node") in backticks so the body
# never mentions an account or team. Authors are printed as plain logins for the same reason.
no_mentions() {
  sed -E 's/(^|[^`[:alnum:]])(@[[:alnum:]][-[:alnum:]_./]*)/\1`\2`/g'
}

declare -A seen_pr=()
pr_lines=()
direct_lines=()
while IFS=$'\t' read -r sha author subject; do
  pr=$(gh api "repos/${GH_REPO}/commits/${sha}/pulls" --jq \
    '[.[] | select(.merged_at != null and .base.ref == "uat")][0] // empty | [.number, .title, .user.login] | @tsv' </dev/null)
  if [ -z "$pr" ]; then
    direct_lines+=("- ${sha:0:7} $(no_mentions <<<"$subject") (${author})")
    continue
  fi
  IFS=$'\t' read -r number title login <<<"$pr"
  # A rebase merge puts several commits from the same PR on uat; list the PR once.
  [ -n "${seen_pr[$number]:-}" ] && continue
  seen_pr[$number]=1
  pr_lines+=("- #${number} $(no_mentions <<<"$title") (${login})")
done < <(git log --first-parent --reverse --format='%H%x09%an%x09%s' "$base_sha..$head_sha")

# GitHub caps a PR body at 65536 characters. Keep the lists well under that and point at the
# Commits tab for the rest.
budget=60000
print_list() {
  local line shown=0
  for line in "$@"; do
    budget=$((budget - ${#line} - 1))
    if [ "$budget" -lt 0 ]; then
      echo "- …and $(($# - shown)) more, see the Commits tab"
      return
    fi
    echo "$line"
    shown=$((shown + 1))
  done
}

plural() { if [ "$1" -eq 1 ]; then echo "$1 $2"; else echo "$1 $2s"; fi; }

cat <<EOF
<!-- Rewritten by .github/scripts/promotion-pr-body.sh on every push to uat. Edits made here are overwritten. -->
Approving this PR releases \`uat\` to production: once the required checks pass, the PromoteUatToMain workflow fast-forwards \`main\` to the commit you approved. Don't press Merge, which would give \`main\` a commit \`uat\` doesn't have. If \`uat\` moves after you approve, approve the new head.

## Going to main

EOF

if [ "${#pr_lines[@]}" -gt 0 ]; then
  echo "$(plural "${#pr_lines[@]}" "pull request") merged into \`uat\` since the last promotion, oldest first:"
  echo
  print_list "${pr_lines[@]}"
  echo
fi

if [ "${#direct_lines[@]}" -gt 0 ]; then
  echo "$(plural "${#direct_lines[@]}" "commit") pushed to \`uat\` without a pull request:"
  echo
  print_list "${direct_lines[@]}"
  echo
fi

echo "\`main\` ${base_sha:0:7} → \`uat\` ${head_sha:0:7}: $(plural "$commit_count" commit) in total ([full diff](https://github.com/${GH_REPO}/compare/${base_sha}...${head_sha}))."
