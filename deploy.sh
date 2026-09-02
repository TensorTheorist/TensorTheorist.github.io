#!/usr/bin/env bash
# Stage every change, cache-bust script.js and style.css in the HTML,
# commit, and push to main. GitHub Pages auto-rebuilds on push.
#
# Usage:
#   ./deploy.sh                 # default message "Update site"
#   ./deploy.sh "Your message"  # your commit message
set -euo pipefail

cd "$(dirname "$0")"

msg="${1:-Update site}"

# UTC timestamp — bumps on every deploy, so browsers refetch script.js/style.css.
STAMP=$(date -u +%Y%m%d%H%M%S)

# Rewrite src="script.js[?v=...]" and href="style.css[?v=...]" to use the new stamp,
# across every top-level HTML file.
for f in *.html; do
  [[ -f "$f" ]] || continue
  # First strip any existing ?v=... on those two files.
  perl -i -pe 's{(src|href)="(script\.js|style\.css)\?v=[^"]*"}{$1="$2"}g' "$f"
  # Then append the fresh stamp.
  perl -i -pe "s{(src|href)=\"(script\.js|style\.css)\"}{\$1=\"\$2?v=${STAMP}\"}g" "$f"
done

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Nothing to commit. Working tree is clean."
  exit 0
fi

git add -A
git commit -m "$msg"
git push

echo
echo "Pushed (cache-bust v=$STAMP). GitHub Pages will rebuild in ~30-60s."
echo "Live at: https://tensortheorist.github.io"
