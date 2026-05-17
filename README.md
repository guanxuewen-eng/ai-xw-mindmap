# ai-xw-mindmap

Portable AI-agent integration package for 新网脑图.

This repository contains:

- `agent-skills/xw-mindmap`: a filesystem Skill for agents that support `SKILL.md`.
- `agent-skills/install-xw-mindmap.sh`: one-command installer for Codex, Claude Code, Hermes, and OpenClaw style skill directories.
- `skill-client`: a small Node 18+ SDK for the Skill API.
- `release`: prebuilt `.tgz` packages for manual download or GitHub Releases.
- `docs`: publishing and distribution notes.

## Supported Agents

```bash
./agent-skills/install-xw-mindmap.sh codex
./agent-skills/install-xw-mindmap.sh claude-code
./agent-skills/install-xw-mindmap.sh hermes
./agent-skills/install-xw-mindmap.sh openclaw
./agent-skills/install-xw-mindmap.sh all
```

Install destinations:

- Codex: `~/.codex/skills/xw-mindmap`
- Claude Code: `~/.claude/skills/xw-mindmap`
- Hermes: `~/.hermes/skills/xw-mindmap`
- OpenClaw: `~/.openclaw/skills/xw-mindmap`

Restart the agent after installation so its Skill list refreshes.

## Quick Install

```bash
git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git
cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex
```

First run:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs choose-new
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

The runtime stores the local device id and Skill token in:

```text
~/.config/mind-workspace/device.json
```

Do not publish or delete that file. Updating this repository or reinstalling the Skill does not clear it.

## Current Capabilities

- Discover server capabilities.
- Create or claim a local Skill identity.
- Open or create a mind-map project.
- Read the current mind-map document and revision.
- Submit reviewable AI proposals.
- Watch committed proposal and proposal-derived node events.

Direct command execution is not included in this release. The safe production path is proposal-first: an agent drafts changes, then a human commits or rejects them in the web editor.

## Downloads

Release artifacts are checked into `release/` for convenience:

- `release/xw-mindmap-agent-skill-0.1.0.tgz`
- `release/mind-workspace-skill-client-0.1.0.tgz`

## Documentation

- [Skill install and usage](agent-skills/README.md)
- [Distribution notes](docs/AGENT_SKILL_DISTRIBUTION.md)
- [GitHub release checklist](docs/GITHUB_RELEASE_CHECKLIST.md)
- [SDK README](skill-client/README.md)

## Security

Never commit local secrets:

- `~/.config/mind-workspace/device.json`
- `.env`
- Skill tokens
- JWTs
- database passwords
- server SSH credentials

The bundled CLI redacts tokens from normal output.

