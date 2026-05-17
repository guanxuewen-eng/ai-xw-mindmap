# Agent Skill Distribution

This repository ships a portable `xw-mindmap` Skill for AI coding agents.

For a user-facing overview, see `agent-skills/README.md`.
For publishing, see `docs/GITHUB_RELEASE_CHECKLIST.md`.

## Install From A Git Checkout

```bash
git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git
cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex
./agent-skills/install-xw-mindmap.sh claude-code
./agent-skills/install-xw-mindmap.sh hermes
./agent-skills/install-xw-mindmap.sh openclaw
```

Use `all` to install into all supported local directories.

## Supported Directories

- Codex: `~/.codex/skills/xw-mindmap/SKILL.md`
- Claude Code: `~/.claude/skills/xw-mindmap/SKILL.md`
- Hermes: `~/.hermes/skills/xw-mindmap/SKILL.md`
- OpenClaw: `~/.openclaw/skills/xw-mindmap/SKILL.md`

The skill is plain `SKILL.md` plus a bundled Node script, so agents that support filesystem skills can load it without npm installation.

## GitHub Raw Install Pattern

For machines that do not need the full repo, copy `agent-skills/xw-mindmap/` into the agent's skill directory. The directory must contain:

- `SKILL.md`
- `agents/openai.yaml` for Codex UI metadata
- `scripts/xw-mindmap.mjs`

## Runtime

The bundled script requires Node 18 or newer for global `fetch`.

Default API:

```bash
http://183.223.249.216:58003
```

Override for local development:

```bash
XW_MINDMAP_API=http://127.0.0.1:58003 node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

## First Run

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs choose-new
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

The script stores device identity and Skill token in `~/.config/mind-workspace/device.json`. Do not publish or print that file.
