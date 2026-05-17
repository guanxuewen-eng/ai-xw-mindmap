# xw-mindmap Agent Skill

`xw-mindmap` lets AI coding agents work with 新网脑图 through the Skill API.

It supports:

- Discovering server capabilities and claiming a local Skill identity.
- Creating or opening a mind-map project.
- Reading the current mind-map document.
- Submitting reviewable AI proposals.
- Watching committed proposal and node events.

Direct silent mutation is intentionally not enabled by default. The current production-safe workflow is proposal-first: the agent drafts a structured change proposal, then the user commits or rejects it in the web editor.

## Install

From a Git checkout:

```bash
git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git
cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex
```

Supported targets:

```bash
./agent-skills/install-xw-mindmap.sh codex
./agent-skills/install-xw-mindmap.sh claude-code
./agent-skills/install-xw-mindmap.sh hermes
./agent-skills/install-xw-mindmap.sh openclaw
./agent-skills/install-xw-mindmap.sh all
```

Install paths:

- Codex: `~/.codex/skills/xw-mindmap/SKILL.md`
- Claude Code: `~/.claude/skills/xw-mindmap/SKILL.md`
- Hermes: `~/.hermes/skills/xw-mindmap/SKILL.md`
- OpenClaw: `~/.openclaw/skills/xw-mindmap/SKILL.md`

After installing, restart the agent app so its Skill list is refreshed.

## Updates

The Skill includes a small self-updater. Every normal CLI run checks the GitHub version manifest at most once per day and automatically refreshes the installed Skill files when a newer version is available. The local device id and Skill token stay in `~/.config/mind-workspace/device.json`, outside the Skill folder, so updates do not log users out.

Manual commands:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs check-update
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs update
```

For pinned/offline environments:

```bash
XW_MINDMAP_NO_UPDATE=1 node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

## First Run

The bundled script requires Node 18 or newer.

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs choose-new --agent-name "Codex 架构助手"
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

Each AI should choose one stable collaborator name for itself on first run. The name is displayed to users in collaboration and history views, so use a short Chinese name that feels like a helpful AI teammate. You can also set it with `XW_MINDMAP_AGENT_NAME`.

The script stores device identity and Skill token in:

```text
~/.config/mind-workspace/device.json
```

Do not publish, delete, or print this file. It is intentionally outside the Skill folder so updating the Skill does not clear local authorization.

## Common Agent Prompts

```text
使用 xw-mindmap 技能，创建一个“项目架构设计”脑图。
```

```text
调用新网脑图技能，打开这个脑图并提交一组结构优化提案。
```

```text
用 xw-mindmap 监听这个脑图 60 秒，看是否有 AI 提案提交事件。
```

## CLI Examples

Discover capabilities:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

Open or create by title:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

Read a document:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs get --id <mindMapId>
```

Submit a proposal:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs propose --file proposal.json
```

Watch events:

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs watch --id <mindMapId> --seconds 60
```

## Proposal JSON

```json
{
  "mindMapId": "uuid",
  "baseRevision": 1,
  "rationale": "Generate a project architecture outline",
  "idempotencyKey": "agent-unique-key",
  "operations": [
    {
      "opId": "op_1",
      "type": "create_node",
      "target": { "parentUid": "root-node-uid" },
      "payload": { "tempUid": "$temp:architecture", "text": "系统架构" },
      "reason": "Add the top-level architecture branch"
    }
  ]
}
```

Before proposing, read the document first so the agent has the correct node UIDs and current revision.

## Configuration

Production API:

```text
http://183.223.249.216:58003
```

Override for local development:

```bash
XW_MINDMAP_API=http://127.0.0.1:58003 node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

Optional client label:

```bash
XW_MINDMAP_CLIENT=claude-code node ~/.claude/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

## Safety Model

- Tokens are stored locally and redacted from CLI output.
- Structural edits should use proposals.
- Destructive edits should be explicitly approved by the user.
- Direct command mode should only be enabled after the server implements permission gates, audit logging, idempotency, revision checks, and rollback strategy.

## Current Limitations

- `watch` is reliable for committed AI proposals and proposal-derived node events.
- Direct front-end saves may still require re-reading the full document until the front-end emits fine-grained save events.
- Direct command/control is not part of this release.
