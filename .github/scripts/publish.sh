#!/bin/bash
# Publishes packages to npm from the Release GitHub workflow.
#
# Modes (selected by PUBLISH_MODE):
#   prerelease  - push to main: publish a prerelease under the `next` dist tag. Lerna's own version
#                 commits (`chore(release): v<version>`) are skipped.
#   release     - manual run on main: `lerna publish` determines the next version from conventional
#                 commits since the last release, updates the CHANGELOG.md files, commits
#                 `chore(release): v<version>`, tags it, pushes the commit and tag to main, creates the
#                 GitHub Release and publishes under the `latest` dist tag.
#   recover     - manual run on main: publish package versions that are in package.json but not yet on
#                 npm, under the `latest` dist tag. With DRY_RUN=true only report what would be published.
#
# Prerelease versions are committed and tagged locally only (`lerna version --amend` does not push).
#
# `lerna publish` runs with `--loglevel verbose` so the logs show whether the OIDC exchange succeeded.
# Keep it until trusted publishing is verified; it can be dropped afterwards.
set -euo pipefail

PUBLISH_MODE="${PUBLISH_MODE:-prerelease}"
DRY_RUN="${DRY_RUN:-true}"
REF="${GITHUB_REF:?GITHUB_REF is required}"
SHORT_SHA1="$(git rev-parse --short=7 HEAD)"

publish_recover() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Dry run: comparing local package versions with the npm registry."
    npx lerna list --json --loglevel silent | node -e '
      const { execFileSync } = require("child_process");
      const packages = JSON.parse(require("fs").readFileSync(0, "utf8"));
      for (const { name, version } of packages) {
        let published = false;
        try {
          published = execFileSync("npm", ["view", `${name}@${version}`, "version"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
          }).trim() === version;
        } catch (e) {
          // npm view exits non-zero when the version does not exist
        }
        console.log(`${name}@${version}: ${published ? "already published" : "would be published"}`);
      }
    '
    return
  fi
  npx lerna publish from-package \
    --loglevel verbose \
    --ignore-scripts \
    --dist-tag latest \
    --yes
}

# Requires that main accepts a direct push of the version commit and tag from this workflow's token.
# `--create-release github` reads the token from GH_TOKEN.
publish_release() {
  npx lerna publish \
    --conventional-commits \
    --create-release github \
    --dist-tag latest \
    --ignore-scripts \
    --no-commit-hooks \
    --loglevel verbose \
    --yes
}

publish_prerelease() {
  local preid="$1"
  local dist_tag="$2"
  npx lerna version prerelease \
    --amend \
    --ignore-scripts \
    --no-commit-hooks \
    --preid "$preid" \
    --yes
  npx lerna publish from-git \
    --loglevel verbose \
    --ignore-scripts \
    --pre-dist-tag "$dist_tag" \
    --yes
}

if [[ "$REF" != "refs/heads/main" ]]; then
  echo "Publishing is only allowed from refs/heads/main, not ${REF}." >&2
  exit 1
fi

case "$PUBLISH_MODE" in
  release)
    publish_release
    ;;
  recover)
    publish_recover
    ;;
  prerelease)
    SUBJECT="$(git log --format=%s -n 1)"
    # Lerna's version commit is already published under `latest`. Pushes made with the workflow's
    # GITHUB_TOKEN do not start new workflow runs, so this only applies if that commit reaches main
    # some other way.
    if [[ "$SUBJECT" =~ ^chore\(release\):\ v ]]; then
      echo "Skipping prerelease for release commit: ${SUBJECT}"
      exit 0
    fi
    publish_prerelease "$SHORT_SHA1" next
    ;;
  *)
    echo "Unknown PUBLISH_MODE: ${PUBLISH_MODE}" >&2
    exit 1
    ;;
esac
