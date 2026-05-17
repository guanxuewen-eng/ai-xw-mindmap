/**
 * Lightweight storage for the Skill device-id and (optionally) the issued token.
 *
 * Default storage path: `~/.config/mind-workspace/device.json`
 *
 * The device-id is created lazily on first read and persisted forever.
 * The token is written after `identify` / `account/choose` / `verify` succeed
 * and reused by subsequent calls so the client never has to re-prompt the user.
 */
export type DeviceStorageData = {
    deviceId: string;
    token?: string;
    userId?: string;
    handle?: string;
    displayName?: string;
};
export interface DeviceStorage {
    read(): Promise<DeviceStorageData>;
    write(patch: Partial<DeviceStorageData>): Promise<DeviceStorageData>;
    clearToken(): Promise<void>;
}
export declare function defaultStoragePath(): string;
export declare class FileDeviceStorage implements DeviceStorage {
    private readonly filePath;
    constructor(filePath?: string);
    read(): Promise<DeviceStorageData>;
    write(patch: Partial<DeviceStorageData>): Promise<DeviceStorageData>;
    clearToken(): Promise<void>;
    private persist;
}
//# sourceMappingURL=storage.d.ts.map