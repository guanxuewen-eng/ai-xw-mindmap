import os from 'os'
import { FileDeviceStorage, DeviceStorage, defaultStoragePath } from './storage'
import {
  AuthState,
  ClientInfo,
  ChooseResponse,
  DiscoverResponse,
  SkillError,
  VerifyStartResponse,
  VerifySubmitResponse,
  WatchEvent,
  OpenRequest,
  OpenResponse,
  ProposeRequest,
  ProposeResponse,
} from './types'

function parseSseBlock(raw: string): { id?: number; ev: WatchEvent } | null {
  let event = ''
  let data = ''
  let id: number | undefined
  for (const line of raw.split('\n')) {
    if (line.startsWith(':')) continue
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data += (data ? '\n' : '') + line.slice(5).trim()
    else if (line.startsWith('id:')) {
      const n = parseInt(line.slice(3).trim(), 10)
      if (Number.isFinite(n)) id = n
    }
  }
  if (!event || !data) return null
  try { return { id, ev: JSON.parse(data) as WatchEvent } } catch { return null }
}

export type SkillClientOptions = {
  /** Base URL of the Mind Workspace backend, e.g. "https://api.mindworkspace.io". No trailing slash needed. */
  baseUrl: string
  /** Identity of the host AI tool. `client` is required; other fields default to OS values. */
  client: ClientInfo
  /** Custom storage backend. Defaults to FileDeviceStorage at ~/.config/mind-workspace/device.json. */
  storage?: DeviceStorage
  /** Custom fetch implementation. Defaults to global fetch (Node ≥18 / browsers). */
  fetch?: typeof fetch
}

/**
 * Programmatic entry point for external coding agents.
 *
 * Typical usage:
 *
 *   const client = new SkillClient({ baseUrl, client: { client: "codex" } })
 *   const state = await client.bootstrap()
 *   if (state.status === "needs_choice") { ... prompt user ... await client.chooseNew() }
 *   await client.propose(mapId, ...) // (added in V2.1)
 */
export class SkillClient {
  private readonly baseUrl: string
  private readonly clientInfo: ClientInfo
  private readonly storage: DeviceStorage
  private readonly fetchImpl: typeof fetch

  constructor(options: SkillClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '')
    this.clientInfo = {
      machine: os.hostname(),
      osUser: os.userInfo().username,
      ...options.client,
    }
    this.storage = options.storage ?? new FileDeviceStorage()
    this.fetchImpl = options.fetch ?? globalThis.fetch
    if (!this.fetchImpl) {
      throw new Error('No fetch implementation available; pass options.fetch on Node <18.')
    }
  }

  /** Convenience: run discover, persist token if returned. Returns the auth state. */
  async bootstrap(): Promise<AuthState> {
    const result = await this.discover()
    await this.persistAuth(result.auth)
    return result.auth
  }

  // ─── 4 core actions (V2.0) ───

  async discover(): Promise<DiscoverResponse> {
    return this.request<DiscoverResponse>('POST', '/api/skill/discover')
  }

  async identify(): Promise<AuthState> {
    const data = await this.request<AuthState>('POST', '/api/skill/identify')
    await this.persistAuth(data)
    return data
  }

  async chooseNew(): Promise<ChooseResponse> {
    const data = await this.request<ChooseResponse>('POST', '/api/skill/account/choose', { choice: 'new' })
    if ('token' in data) {
      await this.storage.write({
        token: data.token,
        userId: data.userId,
        handle: data.handle,
        displayName: data.displayName,
      })
    }
    return data
  }

  async startEmailVerification(email: string): Promise<VerifyStartResponse> {
    return this.request<VerifyStartResponse>('POST', '/api/skill/account/verify', { email })
  }

  async submitEmailCode(challengeId: string, code: string): Promise<VerifySubmitResponse> {
    const data = await this.request<VerifySubmitResponse>('POST', '/api/skill/account/verify/submit', {
      challengeId,
      code,
    })
    await this.storage.write({
      token: data.token,
      userId: data.userId,
      handle: data.handle,
      displayName: data.displayName,
    })
    return data
  }

  /** Drop the locally stored token. Server-side revocation is a separate concern (V3). */
  async forgetToken(): Promise<void> {
    await this.storage.clearToken()
  }

  /**
   * Open/create a mind map. Returns mindMapId + webUrl. Authenticated.
   */
  async open(req: OpenRequest): Promise<OpenResponse> {
    return this.request<OpenResponse>('POST', '/api/skill/open', req)
  }

  /**
   * Submit a proposal authored by the host AI. Server skips its own model call,
   * dry-runs operations, and persists a pending_user proposal. Replays with the
   * same `idempotencyKey` return the existing proposal with `reused:true`.
   */
  async propose(req: ProposeRequest): Promise<ProposeResponse> {
    return this.request<ProposeResponse>('POST', '/api/skill/propose', req)
  }

  /**
   * Subscribe to the SSE event stream for a mind map. Returns a handle with
   * `close()` to stop. The optional `onEvent` callback fires for every named
   * event (node_created/updated/deleted/moved, proposal_state_changed); fine-
   * grained per-type callbacks may be added on the `handlers` object.
   *
   * Requires an authenticated session. Throws if no token is stored.
   */
  async watch(
    mindMapId: string,
    handlers: {
      onEvent?: (ev: WatchEvent) => void
      onOpen?: () => void
      onError?: (err: unknown) => void
      onResyncRequired?: (info: { sinceId: number }) => void
    } = {},
    options: { since?: number } = {}
  ): Promise<{ close: () => void; lastEventId: () => number | undefined }> {
    const stored = await this.storage.read()
    if (!stored.token) throw new SkillError('SKILL_TOKEN_INVALID', 'No skill token stored; bootstrap first.', 401)

    const ac = new AbortController()
    let lastId = options.since
    const sinceParam = options.since ? `&since=${options.since}` : ''
    const url = `${this.baseUrl}/api/skill/watch/${encodeURIComponent(mindMapId)}?token=${encodeURIComponent(stored.token)}${sinceParam}`

    const run = async () => {
      try {
        const headers: Record<string, string> = { Accept: 'text/event-stream' }
        if (lastId) headers['Last-Event-ID'] = String(lastId)
        const res = await this.fetchImpl(url, { method: 'GET', headers, signal: ac.signal })
        if (!res.ok || !res.body) {
          throw new SkillError('HTTP_ERROR', `${res.status} ${res.statusText}`, res.status)
        }
        handlers.onOpen?.()
        const reader = (res.body as any).getReader()
        const decoder = new TextDecoder()
        let buf = ''
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          let idx
          while ((idx = buf.indexOf('\n\n')) >= 0) {
            const raw = buf.slice(0, idx)
            buf = buf.slice(idx + 2)
            const parsed = parseSseBlock(raw)
            if (!parsed) continue
            if (parsed.id !== undefined) lastId = parsed.id
            if (parsed.ev.type === 'resync_required') {
              handlers.onResyncRequired?.({ sinceId: parsed.ev.sinceId })
              continue
            }
            handlers.onEvent?.(parsed.ev)
          }
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return
        handlers.onError?.(err)
      }
    }
    run()
    return { close: () => ac.abort(), lastEventId: () => lastId }
  }

  /** Where the device id and (optionally) token live on disk. Useful for diagnostics. */
  storagePath(): string {
    return defaultStoragePath()
  }

  // ─── Internal ───

  private async request<T>(method: string, pathname: string, body?: unknown): Promise<T> {
    const stored = await this.storage.read()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Skill-Client': this.clientInfo.client,
      'X-Skill-DeviceId': stored.deviceId,
    }
    if (this.clientInfo.clientVersion) headers['X-Skill-ClientVersion'] = this.clientInfo.clientVersion
    if (this.clientInfo.machine) headers['X-Skill-Machine'] = this.clientInfo.machine
    if (this.clientInfo.osUser) headers['X-Skill-OsUser'] = this.clientInfo.osUser
    if (stored.token) headers['Authorization'] = `Bearer ${stored.token}`

    const requestBody = body === undefined && method !== 'GET' && method !== 'HEAD' ? {} : body
    const res = await this.fetchImpl(`${this.baseUrl}${pathname}`, {
      method,
      headers,
      body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
    })

    const text = await res.text()
    let json: any
    try { json = text ? JSON.parse(text) : {} } catch { /* keep as string */ }

    if (!res.ok) {
      const err = json && typeof json.error === 'object'
        ? json.error
        : { code: json?.code || 'HTTP_ERROR', message: json?.message || `${res.status} ${res.statusText}` }
      throw new SkillError(err.code, err.message, res.status, err.details)
    }
    // Backend wraps successes as { ok: true, data: T, requestId }
    return (json && typeof json === 'object' && 'data' in json ? json.data : json) as T
  }

  private async persistAuth(state: AuthState): Promise<void> {
    if (state.status === 'authenticated') {
      await this.storage.write({
        token: state.token,
        userId: state.userId,
        handle: state.handle,
        displayName: state.displayName,
      })
    }
  }
}
