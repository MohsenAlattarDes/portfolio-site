#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

GH="${GH:-/opt/homebrew/bin/gh}"
REPO="MohsenAlattarDes/portfolio-site"

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "Sign in to GitHub (one-time):"
  "$GH" auth login --hostname github.com --git-protocol https --web
fi

if ! "$GH" repo view "$REPO" >/dev/null 2>&1; then
  "$GH" repo create "$REPO" --public --description "Mohsen Alattar — graphic design portfolio" --source=. --remote=origin
else
  git remote set-url origin "https://github.com/${REPO}.git"
fi

git push -u origin main

echo ""
echo "Done: https://github.com/${REPO}"
