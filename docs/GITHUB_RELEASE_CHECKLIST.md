# GitHub Release Checklist For xw-mindmap Skill

This checklist is for publishing the `xw-mindmap` agent Skill and SDK from this repository.

## What Gets Published

Source files:

- `agent-skills/xw-mindmap/SKILL.md`
- `agent-skills/xw-mindmap/agents/openai.yaml`
- `agent-skills/xw-mindmap/scripts/xw-mindmap.mjs`
- `agent-skills/install-xw-mindmap.sh`
- `agent-skills/README.md`
- `docs/AGENT_SKILL_DISTRIBUTION.md`

Release artifacts:

- `release/xw-mindmap-agent-skill-0.1.7.tgz`
- `release/mind-workspace-skill-client-0.1.0.tgz`
- `release/SHA256SUMS`

Local-only files that must not be published:

- `~/.config/mind-workspace/device.json`
- `.env`
- admin tokens, Skill tokens, JWTs, database passwords, API keys

## Before Pushing

Check the remote. Do not push this customized work to the upstream author repository.

```bash
git remote -v
```

Use your own repository:

```bash
git remote set-url origin git@github.com:guanxuewen-eng/ai-xw-mindmap.git
```

Or add a separate remote:

```bash
git remote add xw git@github.com:guanxuewen-eng/ai-xw-mindmap.git
```

## Build And Package

```bash
cd /Users/guan/Projects/simple-mind-map
npm --prefix skill-client run build
mkdir -p release
tar -czf release/xw-mindmap-agent-skill-0.1.7.tgz -C agent-skills xw-mindmap install-xw-mindmap.sh
(cd skill-client && npm pack)
mv -f skill-client/mind-workspace-skill-client-0.1.0.tgz release/
(cd release && shasum -a 256 *.tgz > SHA256SUMS)
```

Verify package contents:

```bash
tar -tzf release/xw-mindmap-agent-skill-0.1.7.tgz
tar -tzf release/mind-workspace-skill-client-0.1.0.tgz | head
(cd release && shasum -a 256 -c SHA256SUMS)
```

## Validate

```bash
node --check agent-skills/xw-mindmap/scripts/xw-mindmap.mjs
bash -n agent-skills/install-xw-mindmap.sh
node agent-skills/xw-mindmap/scripts/xw-mindmap.mjs discover
git diff --check -- agent-skills docs/AGENT_SKILL_DISTRIBUTION.md docs/GITHUB_RELEASE_CHECKLIST.md skill-client/src/client.ts README.md
```

The `discover` output should redact tokens.

## Commit

```bash
git add README.md agent-skills docs/AGENT_SKILL_DISTRIBUTION.md docs/GITHUB_RELEASE_CHECKLIST.md skill-client/src/client.ts skill-client/dist release
git commit -m "Add xw-mindmap agent skill distribution"
```

## Push

```bash
git push xw HEAD:main
```

or, if `origin` points to your own repo:

```bash
git push origin HEAD:main
```

## Create GitHub Release

Tag:

```bash
git tag xw-mindmap-skill-v0.1.7
git push xw xw-mindmap-skill-v0.1.7
```

Attach:

- `release/xw-mindmap-agent-skill-0.1.7.tgz`
- `release/mind-workspace-skill-client-0.1.0.tgz`
- `release/SHA256SUMS`

Suggested release title:

```text
xw-mindmap Agent Skill v0.1.7
```

Suggested release notes:

```markdown
xw-mindmap agent Skill v0.1.7 release.

Includes:
- Portable SKILL.md distribution for Codex, Claude Code, Hermes, and OpenClaw.
- Bundled Node 18+ CLI for discover, choose-new, open, get, propose, and watch.
- SDK package @mind-workspace/skill-client v0.1.0.
- SHA256SUMS for release artifact verification.

Current safety model:
- Proposal-first edits.
- Tokens are stored locally in ~/.config/mind-workspace/device.json and are not included in this release.
- Skill self-update verifies SHA-256 checksums before replacing local files.
- Direct command mode only allows low-risk operations with explicit confirmDirect=true.
```

## If Codex Handles The GitHub Work

Codex can do the full GitHub workflow if one of these is available:

- GitHub plugin/connector installed and authorized.
- `gh` CLI installed and authenticated.
- A repository URL plus a token with repository write permission, provided securely through environment or credential helper.

Do not paste long-lived GitHub tokens into chat. Prefer a short-lived fine-grained token or an installed GitHub connector.
