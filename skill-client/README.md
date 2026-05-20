# @mind-workspace/skill-client

External-agent client SDK for [xw-mindmap](https://github.com/guanxuewen-eng/ai-xw-mindmap).

Lets coding agents (Codex, Claude Code, Hermes, …) discover a Mind Workspace backend, claim a provisioned account on first run, and call mind-map APIs with a long-lived Skill token — no user signup friction.

> **Status:** v0.1 alpha. The current server and SDK support discover, identity bootstrap, account choose/verify, open/create, document read, reviewable proposals, and proposal/event watching. Direct command execution is intentionally not part of this release.

## Install

```bash
npm install @mind-workspace/skill-client
```

Node ≥ 18 (uses global `fetch`).

## Quick start

```ts
import { SkillClient } from '@mind-workspace/skill-client'

const client = new SkillClient({
  baseUrl: 'http://223.85.198.49:58003',
  client: { client: 'codex', clientVersion: '0.4.2' },
})

const auth = await client.bootstrap()

if (auth.status === 'authenticated') {
  console.log(`Hello ${auth.displayName} (@${auth.handle})`)
  // auth.token is now persisted on disk and attached to every subsequent request.
} else {
  // First-run on this machine: ask the user.
  const choice = await promptUser('Do you have an existing Mind Workspace account? (y/N)')
  if (choice === 'y') {
    const email = await promptUser('Email:')
    const { challengeId } = await client.startEmailVerification(email)
    const code = await promptUser('6-digit code we just sent:')
    await client.submitEmailCode(challengeId, code)
  } else {
    await client.chooseNew() // provisions an account based on $USER + hostname
  }
}
```

## What "Skill identity" means

The first time a Skill client runs on a machine, the SDK:

1. Generates a random UUID and writes it to `~/.config/mind-workspace/device.json` (mode 600).
2. Calls `POST /api/skill/discover` with that UUID in `X-Skill-DeviceId`.
3. Backend either matches an existing device (returns a token) or replies `needs_choice`.

The user can then create a fresh **provisioned account** (display name and handle seeded from `$USER`, no email needed) or merge the new device into an existing email-bound account via a 6-digit code.

Once a token is issued, the SDK caches it next to the device id and attaches it as `Authorization: Bearer sk_…` to every subsequent request. The backend's existing `/api/mind-maps/*` routes accept this token in the same place a JWT goes, so the SDK doesn't need a separate proposal API.

## API surface

| Method | What it does |
|--------|--------------|
| `bootstrap()` | `discover()` + persist token if one was issued. Use this on launch. |
| `discover()` | Returns capabilities + auth state. |
| `identify()` | Same as discover but without capabilities. Use after a token revoke. |
| `chooseNew()` | Provisions a new account on the current device. |
| `startEmailVerification(email)` | Begin merging this device into an existing account. |
| `submitEmailCode(challengeId, code)` | Complete the merge with the 6-digit code. |
| `openMindMap(input)` | Open, create, or ensure a mind-map project. |
| `getMindMap(id)` | Read the current document and revision. |
| `submitProposal(input)` | Submit reviewable structural operations. |
| `watchEvents(input)` | Stream proposal and node events for a bounded interval. |
| `forgetToken()` | Drop the local token (server-side revoke comes in V3). |
| `storagePath()` | Where device id + token live on disk. |

## Storage

By default the SDK uses `FileDeviceStorage` rooted at `~/.config/mind-workspace/device.json`.

To put the state somewhere else (e.g. a secrets vault, or `localStorage` in a browser host), pass your own `DeviceStorage`:

```ts
import { SkillClient, DeviceStorage, DeviceStorageData } from '@mind-workspace/skill-client'

class MemoryStorage implements DeviceStorage {
  private state: DeviceStorageData = { deviceId: crypto.randomUUID() }
  async read() { return this.state }
  async write(patch: Partial<DeviceStorageData>) { this.state = { ...this.state, ...patch }; return this.state }
  async clearToken() { delete this.state.token }
}

const client = new SkillClient({ baseUrl, client: { client: 'mybot' }, storage: new MemoryStorage() })
```

## Errors

All API errors throw a `SkillError`:

```ts
import { SkillError } from '@mind-workspace/skill-client'

try {
  await client.chooseNew()
} catch (e) {
  if (e instanceof SkillError && e.code === 'DEVICE_ALREADY_LINKED') {
    // … rerun identify() to recover the existing token
  } else {
    throw e
  }
}
```

The full error code list lives in the backend's [ERROR_CODES_CONTRACT.md](../docs/ERROR_CODES_CONTRACT.md). Skill-specific codes: `SKILL_TOKEN_INVALID`, `SKILL_HEADERS_MISSING`, `EMAIL_NOT_FOUND`, `VERIFICATION_CODE_INVALID`, `VERIFICATION_EXPIRED`, `DEVICE_ALREADY_LINKED`.

## License

MIT
