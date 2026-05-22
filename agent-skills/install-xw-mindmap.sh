#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$ROOT/xw-mindmap"
AGENT="${1:-all}"

copy_skill() {
  local dest="$1"
  local installed_at
  installed_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  mkdir -p "$dest"
  rm -rf "$dest/xw-mindmap"
  cp -R "$SRC" "$dest/xw-mindmap"
  chmod +x "$dest/xw-mindmap/scripts/xw-mindmap.mjs" 2>/dev/null || true
  cat > "$dest/xw-mindmap/.xw-mindmap-skill.json" <<JSON
{
  "version": "0.1.7",
  "installedAt": "$installed_at",
  "installTarget": "$dest",
  "repoUrl": "https://github.com/guanxuewen-eng/ai-xw-mindmap",
  "manifestUrl": "https://api.github.com/repos/guanxuewen-eng/ai-xw-mindmap/contents/agent-skills/xw-mindmap/skill-version.json?ref=main",
  "autoUpdate": true
}
JSON
  chmod 600 "$dest/xw-mindmap/.xw-mindmap-skill.json" 2>/dev/null || true
  echo "installed: $dest/xw-mindmap"
}

case "$AGENT" in
  codex)
    copy_skill "$HOME/.codex/skills"
    ;;
  claude|claude-code)
    copy_skill "$HOME/.claude/skills"
    ;;
  hermes)
    copy_skill "$HOME/.hermes/skills"
    ;;
  openclaw)
    copy_skill "$HOME/.openclaw/skills"
    ;;
  all)
    copy_skill "$HOME/.codex/skills"
    copy_skill "$HOME/.claude/skills"
    copy_skill "$HOME/.hermes/skills"
    copy_skill "$HOME/.openclaw/skills"
    ;;
  *)
    echo "usage: $0 [all|codex|claude|claude-code|hermes|openclaw]" >&2
    exit 2
    ;;
esac
