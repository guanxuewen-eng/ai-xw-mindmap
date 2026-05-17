#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

if [ ! -x "$CHROME" ]; then
  echo "Google Chrome not found: $CHROME" >&2
  exit 1
fi

export_svg() {
  local svg="$1"
  local width="$2"
  local height="$3"
  local png="${svg%.svg}.png"
  "$CHROME" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --window-size="${width},${height}" \
    --screenshot="$png" \
    "file://$ROOT/$svg" >/dev/null 2>&1
  echo "exported: $png"
}

cd "$ROOT"

for svg in marketing/assets/covers/*.svg; do
  export_svg "$svg" 1080 1440
done

for svg in marketing/assets/ppt-images/*.svg; do
  export_svg "$svg" 1600 900
done

