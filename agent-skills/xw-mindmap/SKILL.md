---
name: xw-mindmap
description: Use when an AI coding agent needs to work with AI 脑图 / Simple Mind Map through the Skill API: discover or claim an agent identity, open or create mind-map projects, read current documents, submit reviewable AI change proposals, and watch committed proposal events. Trigger when the user asks to draw, generate, modify, review, synchronize, monitor, or communicate through a mind map.
metadata:
  short-description: Open, read, propose, and watch AI 脑图
---

# AI 脑图 Skill

This skill connects an AI agent to the AI 脑图 server-side Skill API.

## Current Status

- Supports `discover`, `open`, `create`, `read`, `propose`, `watch`, `accept-invite`, `command`, `check-update`, and `update`.
- Direct silent mutation is not the default. Use proposal-first edits unless the user explicitly asks for low-risk direct commands and passes `confirmDirect=true`.
- Watch events cover ordinary user saves, proposal commits/rejections/failures, direct-command changes, restore events, and fine-grained node events recorded by the server.

## Endpoints

- Production web: `http://223.85.198.49:58002`
- Production API: `http://223.85.198.49:58002`

Use `XW_MINDMAP_API` to override the API base URL for local development.

## Preferred Tooling

Use the bundled script when available:

```bash
node <skill-dir>/scripts/xw-mindmap.mjs discover
node <skill-dir>/scripts/xw-mindmap.mjs choose-new --agent-name "Codex 架构助手"
node <skill-dir>/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
node <skill-dir>/scripts/xw-mindmap.mjs get --id <mindMapId>
node <skill-dir>/scripts/xw-mindmap.mjs propose --file proposal.json
node <skill-dir>/scripts/xw-mindmap.mjs watch --id <mindMapId> --seconds 60
node <skill-dir>/scripts/xw-mindmap.mjs accept-invite --code <inviteCode>
node <skill-dir>/scripts/xw-mindmap.mjs check-update
node <skill-dir>/scripts/xw-mindmap.mjs update
```

The script stores its device id and Skill token in `~/.config/mind-workspace/device.json`. Never print the raw token.

## Automatic Updates

This skill is updated frequently. The bundled script checks the GitHub version manifest at most once per day and automatically refreshes the installed Skill files when a newer version is available. It verifies SHA-256 checksums before replacing local files. The local Skill token is stored outside the Skill directory, so updates do not delete authorization.

Manual update commands:

```bash
node <skill-dir>/scripts/xw-mindmap.mjs check-update
node <skill-dir>/scripts/xw-mindmap.mjs update
```

Set `XW_MINDMAP_NO_UPDATE=1` only for offline or pinned environments.

## Accepting Project Invites

When a human shares an AI collaboration invite, run the provided command after `discover` / `choose-new` has created this agent's local identity:

```bash
node <skill-dir>/scripts/xw-mindmap.mjs accept-invite --code xw_inv_...
```

The invite grants this AI account the permission chosen by the project owner, usually `viewer` or `editor`. After accepting, open the returned `webUrl` or use `open --mode open --id <mindMapId>`.

## AI Account Name

When this skill creates or claims a provisioned AI account, choose a stable collaborator name for yourself and pass it with `--agent-name` or `XW_MINDMAP_AGENT_NAME`. The name is shown to the human user in collaboration and history views.

Name requirements:

- Use a short, reassuring Chinese name that sounds like a helpful AI teammate, for example `Codex 架构助手`, `Claude 脑图助手`, or `项目梳理助手`.
- Keep one stable name per agent installation. Do not rename yourself every task.
- Avoid pretending to be the human user, a company employee, or a real person.
- Do not include secrets, hostnames, emails, API keys, or machine identifiers in the name.

Example:

```bash
node <skill-dir>/scripts/xw-mindmap.mjs choose-new --agent-name "Codex 架构助手"
```

## Proposal JSON Shape

Use reviewable operations:

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

Before proposing, read the document with `get` if node UIDs or current content are needed. Use the returned `revision` as `baseRevision`.

## Safety Rules

- Do not expose Skill tokens, JWTs, API keys, database passwords, or admin tokens.
- Prefer proposals for structural edits.
- For destructive edits, ask first or submit a clearly named proposal for human review.
- If direct command/control is required, verify the server has a direct-command endpoint before claiming support.
