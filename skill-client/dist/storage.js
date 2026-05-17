"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDeviceStorage = void 0;
exports.defaultStoragePath = defaultStoragePath;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const crypto_1 = __importDefault(require("crypto"));
function defaultStoragePath() {
    return path_1.default.join(os_1.default.homedir(), '.config', 'mind-workspace', 'device.json');
}
class FileDeviceStorage {
    filePath;
    constructor(filePath = defaultStoragePath()) {
        this.filePath = filePath;
    }
    async read() {
        try {
            const raw = await fs_1.promises.readFile(this.filePath, 'utf8');
            const parsed = JSON.parse(raw);
            if (parsed.deviceId)
                return parsed;
        }
        catch (err) {
            if (err.code !== 'ENOENT')
                throw err;
        }
        const fresh = { deviceId: crypto_1.default.randomUUID() };
        await this.persist(fresh);
        return fresh;
    }
    async write(patch) {
        const current = await this.read();
        const next = { ...current, ...patch };
        await this.persist(next);
        return next;
    }
    async clearToken() {
        const current = await this.read();
        delete current.token;
        delete current.userId;
        delete current.handle;
        delete current.displayName;
        await this.persist(current);
    }
    async persist(data) {
        await fs_1.promises.mkdir(path_1.default.dirname(this.filePath), { recursive: true, mode: 0o700 });
        await fs_1.promises.writeFile(this.filePath, JSON.stringify(data, null, 2), { mode: 0o600 });
        // writeFile honors `mode` only when creating; if the file already exists,
        // chmod explicitly so we never accidentally widen a previously-loose mode.
        await fs_1.promises.chmod(this.filePath, 0o600).catch(() => { });
    }
}
exports.FileDeviceStorage = FileDeviceStorage;
//# sourceMappingURL=storage.js.map