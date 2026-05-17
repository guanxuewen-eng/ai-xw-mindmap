# xw-mindmap Release Artifacts

This directory contains local release packages.

## Files

- `xw-mindmap-agent-skill-0.1.0.tgz`  
  Portable Skill package for Codex, Claude Code, Hermes, and OpenClaw.

- `mind-workspace-skill-client-0.1.0.tgz`  
  npm package tarball for `@mind-workspace/skill-client`.

## Install Skill Package Manually

```bash
mkdir -p ~/.codex/skills
tar -xzf xw-mindmap-agent-skill-0.1.0.tgz -C ~/.codex/skills
```

For Claude Code:

```bash
mkdir -p ~/.claude/skills
tar -xzf xw-mindmap-agent-skill-0.1.0.tgz -C ~/.claude/skills
```

The tarball also includes `install-xw-mindmap.sh`, which can be used from a temporary extraction directory.

## Install SDK Tarball

```bash
npm install ./mind-workspace-skill-client-0.1.0.tgz
```

## Security

These packages do not include local device tokens. The runtime token lives in:

```text
~/.config/mind-workspace/device.json
```

