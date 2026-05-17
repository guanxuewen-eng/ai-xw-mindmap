import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'

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
  deviceId: string
  token?: string
  userId?: string
  handle?: string
  displayName?: string
}

export interface DeviceStorage {
  read(): Promise<DeviceStorageData>
  write(patch: Partial<DeviceStorageData>): Promise<DeviceStorageData>
  clearToken(): Promise<void>
}

export function defaultStoragePath(): string {
  return path.join(os.homedir(), '.config', 'mind-workspace', 'device.json')
}

export class FileDeviceStorage implements DeviceStorage {
  constructor(private readonly filePath: string = defaultStoragePath()) {}

  async read(): Promise<DeviceStorageData> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8')
      const parsed = JSON.parse(raw) as Partial<DeviceStorageData>
      if (parsed.deviceId) return parsed as DeviceStorageData
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err
    }
    const fresh: DeviceStorageData = { deviceId: crypto.randomUUID() }
    await this.persist(fresh)
    return fresh
  }

  async write(patch: Partial<DeviceStorageData>): Promise<DeviceStorageData> {
    const current = await this.read()
    const next = { ...current, ...patch }
    await this.persist(next)
    return next
  }

  async clearToken(): Promise<void> {
    const current = await this.read()
    delete current.token
    delete current.userId
    delete current.handle
    delete current.displayName
    await this.persist(current)
  }

  private async persist(data: DeviceStorageData): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true, mode: 0o700 })
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), { mode: 0o600 })
    // writeFile honors `mode` only when creating; if the file already exists,
    // chmod explicitly so we never accidentally widen a previously-loose mode.
    await fs.chmod(this.filePath, 0o600).catch(() => {})
  }
}