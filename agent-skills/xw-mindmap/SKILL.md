---
name: xw-mindmap
description: Use when an AI coding agent needs to work with 新网脑图 / Simple Mind Map through the Skill API: discover or claim an agent identity, open or create mind-map projects, read current documents, submit reviewable AI change proposals, and watch committed proposal events. Trigger when the user asks to draw, generate, modify, review, synchronize, monitor, or communicate through a mind map.
metadata:
  short-description: Open, read, propose, and watch 新网脑图
---

# 新网脑图 Skill

This skill connects an AI agent to the 新网脑图 server-side Skill API.

## Current Status

- Supports `discover`, `open`, `propose`, and `watch`.
- Direct silent mutation is not the default. Submit reviewable proposals unless a future direct-command endpoint is explicitly available and the user asks for it.
- Watch events currently cover committed/rejected/failed proposals and fine-grained node events derived from committed proposals. Some direct front-end saves may require re-reading the whole document.

## Endpoints

- Production web: `http://183.223.249.216:58002`
- Production API: `http://183.223.249.216:58003`

Use `XW_MINDMAP_API` to override the API base URL for local development.

## Preferred Tooling

Use the bundled script when available:

```bash
node <skill-dir>/scripts/xw-mindmap.mjs discover
node <skill-dir>/scripts/xw-mindmap.mjs choose-new
node <skill-dir>/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
node <skill-dir>/scripts/xw-mindmap.mjs get --id <mindMapId>
node <skill-dir>/scripts/xw-mindmap.mjs propose --file proposal.json
node <skill-dir>/scripts/xw-mindmap.mjs watch --id <mindMapId> --seconds 60
```

The script stores its device id and Skill token in `~/.config/mind-workspace/device.json`. Never print the raw token.

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

