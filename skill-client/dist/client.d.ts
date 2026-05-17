import { DeviceStorage } from './storage';
import { AuthState, ClientInfo, ChooseResponse, DiscoverResponse, VerifyStartResponse, VerifySubmitResponse, WatchEvent, OpenRequest, OpenResponse, ProposeRequest, ProposeResponse } from './types';
export type SkillClientOptions = {
    /** Base URL of the Mind Workspace backend, e.g. "https://api.mindworkspace.io". No trailing slash needed. */
    baseUrl: string;
    /** Identity of the host AI tool. `client` is required; other fields default to OS values. */
    client: ClientInfo;
    /** Custom storage backend. Defaults to FileDeviceStorage at ~/.config/mind-workspace/device.json. */
    storage?: DeviceStorage;
    /** Custom fetch implementation. Defaults to global fetch (Node ≥18 / browsers). */
    fetch?: typeof fetch;
};
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
export declare class SkillClient {
    private readonly baseUrl;
    private readonly clientInfo;
    private readonly storage;
    private readonly fetchImpl;
    constructor(options: SkillClientOptions);
    /** Convenience: run discover, persist token if returned. Returns the auth state. */
    bootstrap(): Promise<AuthState>;
    discover(): Promise<DiscoverResponse>;
    identify(): Promise<AuthState>;
    chooseNew(): Promise<ChooseResponse>;
    startEmailVerification(email: string): Promise<VerifyStartResponse>;
    submitEmailCode(challengeId: string, code: string): Promise<VerifySubmitResponse>;
    /** Drop the locally stored token. Server-side revocation is a separate concern (V3). */
    forgetToken(): Promise<void>;
    /**
     * Open/create a mind map. Returns mindMapId + webUrl. Authenticated.
     */
    open(req: OpenRequest): Promise<OpenResponse>;
    /**
     * Submit a proposal authored by the host AI. Server skips its own model call,
     * dry-runs operations, and persists a pending_user proposal. Replays with the
     * same `idempotencyKey` return the existing proposal with `reused:true`.
     */
    propose(req: ProposeRequest): Promise<ProposeResponse>;
    /**
     * Subscribe to the SSE event stream for a mind map. Returns a handle with
     * `close()` to stop. The optional `onEvent` callback fires for every named
     * event (node_created/updated/deleted/moved, proposal_state_changed); fine-
     * grained per-type callbacks may be added on the `handlers` object.
     *
     * Requires an authenticated session. Throws if no token is stored.
     */
    watch(mindMapId: string, handlers?: {
        onEvent?: (ev: WatchEvent) => void;
        onOpen?: () => void;
        onError?: (err: unknown) => void;
        onResyncRequired?: (info: {
            sinceId: number;
        }) => void;
    }, options?: {
        since?: number;
    }): Promise<{
        close: () => void;
        lastEventId: () => number | undefined;
    }>;
    /** Where the device id and (optionally) token live on disk. Useful for diagnostics. */
    storagePath(): string;
    private request;
    private persistAuth;
}
//# sourceMappingURL=client.d.ts.map