#!/bin/bash -e

if [[ `git log --format=%s -n 1` =~ ^chore\(release\):\ v.* ]]; then
  # production release
  npx lerna publish from-git --ignore-scripts -y;
else
  # pre-release or tagged release
  # if branch starts with tagged-release/ then do tagged release, else pre-release
  npx lerna publish --canary --ignore-scripts -y \
    --preid $([[ $CIRCLE_BRANCH =~ ^tagged-release\/.* ]] \
      && echo $(echo $CIRCLE_BRANCH | sed 's:.*/::') --no-pre-dist-tag \
      || echo alpha --pre-dist-tag next);
fi
