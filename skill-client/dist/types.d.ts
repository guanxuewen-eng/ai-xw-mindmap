export type AuthState = {
    status: 'authenticated';
    userId: string;
    handle: string;
    displayName: string;
    token: string;
} | {
    status: 'needs_choice';
    reason: string;
};
export type Capabilities = {
    protocolVersion: string;
    serverVersion: string;
    operations: string[];
    watchEvents: string[];
    maxOperationsPerProposal: number;
    maxNodesPerMindMap: number;
};
export type DiscoverResponse = Capabilities & {
    auth: AuthState;
};
export type ChooseResponse = {
    status: 'anonymous_provisioned';
    userId: string;
    displayName: string;
    handle: string;
    token: string;
    claimUrl: string;
} | {
    next: 'verify_email';
    challengeUrl: string;
};
export type VerifyStartResponse = {
    challengeId: string;
    next: 'submit_code';
    devCode?: string;
};
export type VerifySubmitResponse = {
    status: 'authenticated';
    userId: string;
    displayName: string;
    handle: string;
    token: string;
};
export type ApiError = {
    code: string;
    message: string;
    details?: unknown;
};
export declare class SkillError extends Error {
    code: string;
    statusCode: number;
    details?: unknown | undefined;
    constructor(code: string, message: string, statusCode: number, details?: unknown | undefined);
}
export type ClientInfo = {
    /** Identifier for the host coding agent. e.g. "codex", "claude-code", "hermes". */
    client: string;
    /** Free-form version string. */
    clientVersion?: string;
    /** OS hostname; shown to the user in the cloud account list. Display-only. */
    machine?: string;
    /** OS user (whoami). Used as the seed for the account display name + handle. */
    osUser?: string;
    /** Stable AI collaborator name shown in mind-map accounts, e.g. "Codex 架构助手". */
    agentName?: string;
};
export type WatchEvent = {
    type: 'node_created';
    mindMapId: string;
    revision: number;
    uid: string;
    parentUid: string;
    text: string;
    ts: string;
} | {
    type: 'node_updated';
    mindMapId: string;
    revision: number;
    uid: string;
    text: string;
    changes: string[];
    ts: string;
} | {
    type: 'node_deleted';
    mindMapId: string;
    revision: number;
    uid: string;
    text: string;
    subtreeCount: number;
    ts: string;
} | {
    type: 'node_moved';
    mindMapId: string;
    revision: number;
    uid: string;
    fromParentUid: string;
    toParentUid: string;
    ts: string;
} | {
    type: 'proposal_state_changed';
    mindMapId: string;
    proposalId: string;
    state: 'committed' | 'rejected' | 'failed';
    revision?: number;
    ts: string;
} | {
    type: 'resync_required';
    mindMapId: string;
    sinceId: number;
};
export type OpenMode = 'create' | 'open' | 'ensure';
export type OpenRequest = {
    mode: 'create';
    title: string;
    initialContent?: unknown;
} | {
    mode: 'open';
    mindMapId: string;
} | {
    mode: 'ensure';
    title: string;
    initialContent?: unknown;
};
export type OpenResponse = {
    mindMapId: string;
    title: string;
    revision: number;
    webUrl: string;
    editorOpened: boolean;
};
export type SkillOperation = {
    opId: string;
    type: string;
    target: Record<string, unknown>;
    payload?: Record<string, unknown>;
    reason?: string;
};
export type ProposeRequest = {
    mindMapId: string;
    baseRevision: number;
    operations: SkillOperation[];
    rationale: string;
    idempotencyKey: string;
};
export type ProposeResponse = {
    proposalId: string;
    status: 'pending_user';
    reused: boolean;
    diffSummary: {
        created: number;
        updated: number;
        deleted: number;
        moved: number;
        warnings: string[];
    };
    userActionUrl: string;
};
//# sourceMappingURL=types.d.ts.map