"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillClient = void 0;
const os_1 = __importDefault(require("os"));
const storage_1 = require("./storage");
const types_1 = require("./types");
function parseSseBlock(raw) {
    let event = '';
    let data = '';
    let id;
    for (const line of raw.split('\n')) {
        if (line.startsWith(':'))
            continue;
        if (line.startsWith('event:'))
            event = line.slice(6).trim();
        else if (line.startsWith('data:'))
            data += (data ? '\n' : '') + line.slice(5).trim();
        else if (line.startsWith('id:')) {
            const n = parseInt(line.slice(3).trim(), 10);
            if (Number.isFinite(n))
                id = n;
        }
    }
    if (!event || !data)
        return null;
    try {
        return { id, ev: JSON.parse(data) };
    }
    catch {
        return null;
    }
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
class SkillClient {
    baseUrl;
    clientInfo;
    storage;
    fetchImpl;
    constructor(options) {
        this.baseUrl = options.baseUrl.replace(/\/+$/, '');
        this.clientInfo = {
            machine: os_1.default.hostname(),
            osUser: os_1.default.userInfo().username,
            ...options.client,
        };
        this.storage = options.storage ?? new storage_1.FileDeviceStorage();
        this.fetchImpl = options.fetch ?? globalThis.fetch;
        if (!this.fetchImpl) {
            throw new Error('No fetch implementation available; pass options.fetch on Node <18.');
        }
    }
    /** Convenience: run discover, persist token if returned. Returns the auth state. */
    async bootstrap() {
        const result = await this.discover();
        await this.persistAuth(result.auth);
        return result.auth;
    }
    // ─── 4 core actions (V2.0) ───
    async discover() {
        return this.request('POST', '/api/skill/discover');
    }
    async identify() {
        const data = await this.request('POST', '/api/skill/identify');
        await this.persistAuth(data);
        return data;
    }
    async chooseNew() {
        const data = await this.request('POST', '/api/skill/account/choose', { choice: 'new' });
        if ('token' in data) {
            await this.storage.write({
                token: data.token,
                userId: data.userId,
                handle: data.handle,
                displayName: data.displayName,
            });
        }
        return data;
    }
    async startEmailVerification(email) {
        return this.request('POST', '/api/skill/account/verify', { email });
    }
    async submitEmailCode(challengeId, code) {
        const data = await this.request('POST', '/api/skill/account/verify/submit', {
            challengeId,
            code,
        });
        await this.storage.write({
            token: data.token,
            userId: data.userId,
            handle: data.handle,
            displayName: data.displayName,
        });
        return data;
    }
    /** Drop the locally stored token. Server-side revocation is a separate concern (V3). */
    async forgetToken() {
        await this.storage.clearToken();
    }
    /**
     * Open/create a mind map. Returns mindMapId + webUrl. Authenticated.
     */
    async open(req) {
        return this.request('POST', '/api/skill/open', req);
    }
    /**
     * Submit a proposal authored by the host AI. Server skips its own model call,
     * dry-runs operations, and persists a pending_user proposal. Replays with the
     * same `idempotencyKey` return the existing proposal with `reused:true`.
     */
    async propose(req) {
        return this.request('POST', '/api/skill/propose', req);
    }
    /**
     * Subscribe to the SSE event stream for a mind map. Returns a handle with
     * `close()` to stop. The optional `onEvent` callback fires for every named
     * event (node_created/updated/deleted/moved, proposal_state_changed); fine-
     * grained per-type callbacks may be added on the `handlers` object.
     *
     * Requires an authenticated session. Throws if no token is stored.
     */
    async watch(mindMapId, handlers = {}, options = {}) {
        const stored = await this.storage.read();
        if (!stored.token)
            throw new types_1.SkillError('SKILL_TOKEN_INVALID', 'No skill token stored; bootstrap first.', 401);
        const ac = new AbortController();
        let lastId = options.since;
        const sinceParam = options.since ? `&since=${options.since}` : '';
        const url = `${this.baseUrl}/api/skill/watch/${encodeURIComponent(mindMapId)}?token=${encodeURIComponent(stored.token)}${sinceParam}`;
        const run = async () => {
            try {
                const headers = { Accept: 'text/event-stream' };
                if (lastId)
                    headers['Last-Event-ID'] = String(lastId);
                const res = await this.fetchImpl(url, { method: 'GET', headers, signal: ac.signal });
                if (!res.ok || !res.body) {
                    throw new types_1.SkillError('HTTP_ERROR', `${res.status} ${res.statusText}`, res.status);
                }
                handlers.onOpen?.();
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buf = '';
                while (true) {
                    const { value, done } = await reader.read();
                    if (done)
                        break;
                    buf += decoder.decode(value, { stream: true });
                    let idx;
                    while ((idx = buf.indexOf('\n\n')) >= 0) {
                        const raw = buf.slice(0, idx);
                        buf = buf.slice(idx + 2);
                        const parsed = parseSseBlock(raw);
                        if (!parsed)
                            continue;
                        if (parsed.id !== undefined)
                            lastId = parsed.id;
                        if (parsed.ev.type === 'resync_required') {
                            handlers.onResyncRequired?.({ sinceId: parsed.ev.sinceId });
                            continue;
                        }
                        handlers.onEvent?.(parsed.ev);
                    }
                }
            }
            catch (err) {
                if (err?.name === 'AbortError')
                    return;
                handlers.onError?.(err);
            }
        };
        run();
        return { close: () => ac.abort(), lastEventId: () => lastId };
    }
    /** Where the device id and (optionally) token live on disk. Useful for diagnostics. */
    storagePath() {
        return (0, storage_1.defaultStoragePath)();
    }
    // ─── Internal ───
    async request(method, pathname, body) {
        const stored = await this.storage.read();
        const headers = {
            'Content-Type': 'application/json',
            'X-Skill-Client': this.clientInfo.client,
            'X-Skill-DeviceId': stored.deviceId,
        };
        if (this.clientInfo.clientVersion)
            headers['X-Skill-ClientVersion'] = this.clientInfo.clientVersion;
        if (this.clientInfo.machine)
            headers['X-Skill-Machine'] = this.clientInfo.machine;
        if (this.clientInfo.osUser)
            headers['X-Skill-OsUser'] = this.clientInfo.osUser;
        if (stored.token)
            headers['Authorization'] = `Bearer ${stored.token}`;
        const requestBody = body === undefined && method !== 'GET' && method !== 'HEAD' ? {} : body;
        const res = await this.fetchImpl(`${this.baseUrl}${pathname}`, {
            method,
            headers,
            body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
        });
        const text = await res.text();
        let json;
        try {
            json = text ? JSON.parse(text) : {};
        }
        catch { /* keep as string */ }
        if (!res.ok) {
            const err = json && typeof json.error === 'object'
                ? json.error
                : { code: json?.code || 'HTTP_ERROR', message: json?.message || `${res.status} ${res.statusText}` };
            throw new types_1.SkillError(err.code, err.message, res.status, err.details);
        }
        // Backend wraps successes as { ok: true, data: T, requestId }
        return (json && typeof json === 'object' && 'data' in json ? json.data : json);
    }
    async persistAuth(state) {
        if (state.status === 'authenticated') {
            await this.storage.write({
                token: state.token,
                userId: state.userId,
                handle: state.handle,
                displayName: state.displayName,
            });
        }
    }
}
exports.SkillClient = SkillClient;
//# sourceMappingURL=client.js.map