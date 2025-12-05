#!/usr/bin/env bash

version=$(jq '.version' -r < package.json)

if [ -z "$npm_execpath" ]; then
  echo "Do not run this outside of package scripts"
  exit 1
fi

git add android/ ios/ package.json
git commit -m "Bump version to v${version}"
git tag --annotate v${version} -m "Bump version to v${version}"
