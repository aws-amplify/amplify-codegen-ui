#!/bin/bash -e

if [[ `git log --format=%s -n 1` =~ ^chore\(release\):\ v.* ]]; then
  # production release
  npx lerna publish from-git --ignore-scripts --no-verify-access -y;
else
  SHORT_SHA1=$(echo $CIRCLE_SHA1 | cut -c -7)

  # the commit is not pushed to the repo so user email and name do not matter but need to be set
  git config user.email "nobody@amazon.com"
  git config user.name "circleci"

  # pre-release or tagged release
  # if branch starts with tagged-release/ then do tagged release, else pre-release
  if [[ $CIRCLE_BRANCH =~ ^tagged-release\/.* ]]; then
    TAGGED_RELEASE_NAME=$(echo $CIRCLE_BRANCH | sed 's:.*/::')
    npx lerna version prerelease \
      --amend \
      --ignore-scripts \
      --no-commit-hooks \
      --preid ${TAGGED_RELEASE_NAME}-${SHORT_SHA1} \
      -y
    npx lerna publish from-git \
      --ignore-scripts \
      --no-verify-access \
      --pre-dist-tag $TAGGED_RELEASE_NAME \
      -y;
  else
    npx lerna version prerelease \
      --amend \
      --ignore-scripts \
      --no-commit-hooks \
      --preid $SHORT_SHA1 \
      -y
    npx lerna publish from-git \
      --ignore-scripts \
      --no-verify-access \
      --pre-dist-tag next \
      -y;
  fi;
fi
