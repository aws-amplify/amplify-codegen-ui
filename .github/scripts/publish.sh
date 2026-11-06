#!/bin/bash
# Publishes packages to npm from the Release GitHub workflow.
#
# Modes (selected by PUBLISH_MODE):
#   push          - triggered by a push to main:
#                   * release commit (`chore(release): v<version>`) on main: tag the commit, create the
#                     GitHub Release from CHANGELOG.md and publish under the `latest` dist tag.
#                   * any other commit on main: publish a prerelease under the `next` dist tag.
#   from-package  - manual recovery: publish package versions that are in package.json but not yet on npm,
#                   under the `latest` dist tag. With DRY_RUN=true only report what would be published.
#
# Prerelease versions are committed and tagged locally only (`lerna version --amend` does not push).
#
# `lerna publish` runs with `--loglevel verbose` so the logs show whether the OIDC exchange succeeded.
# Keep it until trusted publishing is verified; it can be dropped afterwards.
set -euo pipefail

PUBLISH_MODE="${PUBLISH_MODE:-push}"
DRY_RUN="${DRY_RUN:-true}"
BRANCH="${GITHUB_REF_NAME:?GITHUB_REF_NAME is required}"
SHORT_SHA1="$(git rev-parse --short=7 HEAD)"

publish_from_package() {
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

create_github_release() {
  local version="$1"
  local notes_file="${RUNNER_TEMP:-/tmp}/release-notes.md"
  if gh release view "v${version}" > /dev/null 2>&1; then
    echo "GitHub Release v${version} already exists."
    return
  fi
  # Extract the CHANGELOG.md section for this version: from its `#`/`##` heading up to the next version heading.
  VERSION="$version" node -e '
    const lines = require("fs").readFileSync("CHANGELOG.md", "utf8").split("\n");
    const isVersionHeading = (line) => /^##? \[\d/.test(line);
    const start = lines.findIndex((line) => isVersionHeading(line) && line.startsWith(`[${process.env.VERSION}]`, line.indexOf("[")));
    if (start === -1) process.exit(0);
    const rest = lines.slice(start + 1);
    const end = rest.findIndex(isVersionHeading);
    process.stdout.write(rest.slice(0, end === -1 ? undefined : end).join("\n").trim() + "\n");
  ' > "$notes_file"
  if [[ "$(tr -d "[:space:]" < "$notes_file")" == "" ]]; then
    echo "No CHANGELOG.md section found for ${version}." >&2
    exit 1
  fi
  gh release create "v${version}" --title "Release v${version}" --notes-file "$notes_file" --verify-tag
}

publish_release() {
  local subject="$1"
  local version
  version="$(echo "$subject" | sed -nE 's/^chore\(release\): v([0-9]+\.[0-9]+\.[0-9]+[^ ]*).*/\1/p')"
  local lerna_version
  lerna_version="$(node -p 'require("./lerna.json").version')"
  if [[ -z "$version" || "$version" != "$lerna_version" ]]; then
    echo "Release commit version '${version}' does not match lerna.json version '${lerna_version}'." >&2
    exit 1
  fi

  # `lerna publish from-git` only publishes versions tagged on HEAD. The release commit is squash-merged,
  # so the tag created by `npm run version` on the release branch is not on this commit; tag it here.
  local tag="v${version}"
  if git rev-parse -q --verify "refs/tags/${tag}" > /dev/null; then
    if [[ "$(git rev-list -n 1 "$tag")" != "$(git rev-parse HEAD)" ]]; then
      echo "Tag ${tag} already exists on a different commit." >&2
      exit 1
    fi
  else
    git tag -a "$tag" -m "$tag"
  fi
  git push origin "refs/tags/${tag}"

  create_github_release "$version"

  npx lerna publish from-git \
    --loglevel verbose \
    --ignore-scripts \
    --dist-tag latest \
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

if [[ "$PUBLISH_MODE" == "from-package" ]]; then
  if [[ "$BRANCH" != "main" ]]; then
    echo "from-package publishing is only allowed from main." >&2
    exit 1
  fi
  publish_from_package
  exit 0
fi

SUBJECT="$(git log --format=%s -n 1)"
if [[ "$BRANCH" == "main" && "$SUBJECT" =~ ^chore\(release\):\ v.* ]]; then
  # production release
  publish_release "$SUBJECT"
elif [[ "$BRANCH" == "main" ]]; then
  # pre-release
  publish_prerelease "$SHORT_SHA1" next
else
  echo "Nothing to publish for branch ${BRANCH}." >&2
  exit 1
fi
