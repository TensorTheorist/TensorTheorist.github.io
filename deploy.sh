#!/usr/bin/env bash
# Stage every change, commit, and push to main.
# GitHub Pages auto-rebuilds on push — no extra deploy step needed.
#
# Usage:
#   ./deploy.sh                 # uses default message "Update site"
#   ./deploy.sh "Your message"  # uses your message
set -euo pipefail

cd "$(dirname "$0")"

msg="${1:-Update site}"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Nothing to commit. Working tree is clean."
  exit 0
fi

git add -A
git commit -m "$msg"
git push

echo
echo "Pushed. GitHub Pages will rebuild in ~30-60s."
echo "Live at: https://tensortheorist.github.io"
