#!/usr/bin/env node
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const DEFAULT_BASE_URL = 'http://223.85.198.49:58002'
const STORAGE_PATH = path.join(os.homedir(), '.config', 'mind-workspace', 'device.json')
const SKILL_VERSION = '0.1.5'
const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000
const SCRIPT_PATH = fileURLToPath(import.meta.url)
const SKILL_DIR = path.dirname(path.dirname(SCRIPT_PATH))
const INSTALL_META_PATH = path.join(SKILL_DIR, '.xw-mindmap-skill.json')
const DEFAULT_MANIFEST_URL = 'https://api.github.com/repos/guanxuewen-eng/ai-xw-mindmap/contents/agent-skills/xw-mindmap/skill-version.json?ref=main'

function usage() {
  console.error(`Usage:
  xw-mindmap discover
  xw-mindmap choose-new --agent-name "Codex 架构助手"
  xw-mindmap open --mode ensure --title "项目架构设计"
  xw-mindmap open --mode open --id <mindMapId>
  xw-mindmap get --id <mindMapId>
  xw-mindmap propose --file proposal.json
  xw-mindmap watch --id <mindMapId> [--seconds 60]
  xw-mindmap accept-invite --code <inviteCode>
  xw-mindmap check-update
  xw-mindmap update

Environment:
  XW_MINDMAP_API         Override API base URL. Default: ${DEFAULT_BASE_URL}
  XW_MINDMAP_AGENT_NAME  Stable AI collaborator name shown in the web app.
  XW_MINDMAP_NO_UPDATE   Set to 1 to disable automatic skill updates.`)
}

function argsToObject(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const cur = argv[i]
    if (!cur.startsWith('--')) {
      out._.push(cur)
      continue
    }
    const key = cur.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) out[key] = true
    else {
      out[key] = next
      i += 1
    }
  }
  return out
}

async function readState() {
  try {
    const raw = await fs.readFile(STORAGE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed.deviceId) return parsed
  } catch {
    // create below
  }
  const state = { deviceId: crypto.randomUUID() }
  return writeState(state)
}

async function writeState(patch) {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true, mode: 0o700 })
  let old = {}
  try { old = JSON.parse(await fs.readFile(STORAGE_PATH, 'utf8')) } catch {}
  const next = { ...old, ...patch }
  await fs.writeFile(STORAGE_PATH, JSON.stringify(next, null, 2), { mode: 0o600 })
  return next
}

async function readInstallMeta() {
  try {
    return JSON.parse(await fs.readFile(INSTALL_META_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function writeInstallMeta(patch) {
  const old = await readInstallMeta()
  const next = {
    installType: 'skill-directory',
    repoUrl: 'https://github.com/guanxuewen-eng/ai-xw-mindmap',
    manifestUrl: DEFAULT_MANIFEST_URL,
    installedAt: old.installedAt || new Date().toISOString(),
    ...old,
    ...patch,
  }
  await fs.writeFile(INSTALL_META_PATH, JSON.stringify(next, null, 2), { mode: 0o600 })
  return next
}

function resolveAgentName(state) {
  const raw = process.env.XW_MINDMAP_AGENT_NAME || state.agentName || ''
  const normalized = String(raw).replace(/\s+/g, ' ').trim()
  return normalized ? normalized.slice(0, 100) : ''
}

function compareVersions(a, b) {
  const pa = String(a || '0').split('.').map(n => parseInt(n, 10) || 0)
  const pb = String(b || '0').split('.').map(n => parseInt(n, 10) || 0)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

async function fetchJson(url) {
  const res = await fetch(withCacheBust(url), { headers: { Accept: 'application/vnd.github.raw+json, application/json', 'Cache-Control': 'no-cache', 'User-Agent': 'xw-mindmap-updater' }, cache: 'no-store' })
  if (!res.ok) throw new Error(`update manifest fetch failed: ${res.status} ${res.statusText}`)
  return res.json()
}

async function fetchBytes(url) {
  const res = await fetch(withCacheBust(url), { headers: { Accept: 'application/vnd.github.raw, */*', 'Cache-Control': 'no-cache', 'User-Agent': 'xw-mindmap-updater' }, cache: 'no-store' })
  if (!res.ok) throw new Error(`update file fetch failed: ${res.status} ${res.statusText}`)
  return Buffer.from(await res.arrayBuffer())
}

function withCacheBust(url) {
  const separator = String(url).includes('?') ? '&' : '?'
  return `${url}${separator}xwUpdateTs=${Date.now()}`
}

function sha256Hex(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex')
}

function verifyFileChecksum(file, bytes) {
  const expected = file.sha256 || file.checksum
  if (!expected) return null
  const normalized = String(expected).replace(/^sha256[:-]/i, '').trim().toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(normalized)) {
    throw new Error(`invalid sha256 in update manifest for ${file.path}`)
  }
  const actual = sha256Hex(bytes)
  if (actual !== normalized) {
    throw new Error(`checksum mismatch for ${file.path}: expected ${normalized}, got ${actual}`)
  }
  return actual
}

async function checkForUpdate({ apply = false, force = false } = {}) {
  if (!force && process.env.XW_MINDMAP_NO_UPDATE === '1') {
    return { skipped: true, reason: 'disabled', currentVersion: SKILL_VERSION }
  }

  const meta = await readInstallMeta()
  const now = Date.now()
  const lastChecked = Date.parse(meta.lastUpdateCheckAt || '')
  if (!force && Number.isFinite(lastChecked) && now - lastChecked < UPDATE_INTERVAL_MS) {
    return { skipped: true, reason: 'interval', currentVersion: SKILL_VERSION, latestVersion: meta.latestVersion || SKILL_VERSION }
  }

  const manifestUrl = process.env.XW_MINDMAP_UPDATE_MANIFEST || meta.manifestUrl || DEFAULT_MANIFEST_URL
  const manifest = await fetchJson(manifestUrl)
  const latestVersion = manifest.version || SKILL_VERSION
  const hasUpdate = compareVersions(latestVersion, SKILL_VERSION) > 0
  await writeInstallMeta({ lastUpdateCheckAt: new Date().toISOString(), latestVersion, manifestUrl })

  if (!hasUpdate || !apply) {
    return { currentVersion: SKILL_VERSION, latestVersion, hasUpdate, manifestUrl }
  }

  const files = Array.isArray(manifest.files) ? manifest.files : []
  if (files.length === 0) throw new Error('update manifest has no files')
  const verified = []
  for (const file of files) {
    if (!file.path || !file.url) continue
    const target = path.resolve(SKILL_DIR, file.path)
    if (!target.startsWith(SKILL_DIR + path.sep)) throw new Error(`refusing update outside skill dir: ${file.path}`)
    const content = await fetchBytes(file.url)
    const checksum = verifyFileChecksum(file, content)
    if (checksum) verified.push(file.path)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, content, { mode: file.executable ? 0o755 : 0o644 })
  }

  await writeInstallMeta({
    version: latestVersion,
    updatedAt: new Date().toISOString(),
    latestVersion,
    manifestUrl,
  })
  return { currentVersion: SKILL_VERSION, latestVersion, hasUpdate: true, updated: true, files: files.map(f => f.path), checksumVerified: verified }
}

async function autoUpdateIfNeeded(command) {
  if (['help', '--help', 'check-update', 'update'].includes(command || '')) return
  try {
    const result = await checkForUpdate({ apply: true })
    if (result.updated) {
      console.error(`xw-mindmap skill updated to ${result.latestVersion}. This command will continue; restart the agent to reload SKILL.md if needed.`)
    }
  } catch (err) {
    if (process.env.XW_MINDMAP_DEBUG_UPDATE === '1') {
      console.error(`xw-mindmap update check failed: ${err.message || err}`)
    }
  }
}

function encodeBase64UrlUtf8(value) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

async function request(method, pathname, body) {
  const baseUrl = (process.env.XW_MINDMAP_API || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const state = await readState()
  const agentName = resolveAgentName(state)
  const headers = {
    'Content-Type': 'application/json',
    'X-Skill-Client': process.env.XW_MINDMAP_CLIENT || 'agent-skill',
    'X-Skill-ClientVersion': '0.1.0',
    'X-Skill-DeviceId': state.deviceId,
    'X-Skill-Machine': os.hostname(),
    'X-Skill-OsUser': os.userInfo().username,
  }
  if (agentName) headers['X-Skill-Agent-Name-B64'] = encodeBase64UrlUtf8(agentName)
  if (state.token) headers.Authorization = `Bearer ${state.token}`

  const requestBody = body === undefined && method !== 'GET' && method !== 'HEAD' ? {} : body
  const res = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers,
    body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : {} } catch { json = { raw: text } }
  if (!res.ok) {
    const err = typeof json.error === 'object'
      ? json.error
      : { code: json.code || 'HTTP_ERROR', message: json.message || `${res.status} ${res.statusText}` }
    throw new Error(`${err.code}: ${err.message}`)
  }
  return json.data ?? json
}

function safePrint(value) {
  const clone = JSON.parse(JSON.stringify(value))
  const hide = (obj) => {
    if (!obj || typeof obj !== 'object') return
    for (const [key, val] of Object.entries(obj)) {
      if (/(token|secret|password|key)$/i.test(key)) obj[key] = '[redacted]'
      else if (typeof val === 'string' && /sk_[A-Za-z0-9_-]+/.test(val)) obj[key] = val.replace(/sk_[A-Za-z0-9_-]+/g, '[redacted]')
      else hide(val)
    }
  }
  hide(clone)
  console.log(JSON.stringify(clone, null, 2))
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const args = argsToObject(rest)
  const agentName = args['agent-name'] || args.agentName
  if (typeof agentName === 'string' && agentName.trim()) {
    await writeState({ agentName: agentName.trim().replace(/\s+/g, ' ').slice(0, 100) })
  }
  if (!command || command === 'help' || command === '--help') {
    usage()
    return
  }
  await autoUpdateIfNeeded(command)

  if (command === 'check-update') {
    safePrint(await checkForUpdate({ force: true }))
    return
  }

  if (command === 'update') {
    safePrint(await checkForUpdate({ apply: true, force: true }))
    return
  }

  if (command === 'discover') {
    const data = await request('POST', '/api/skill/discover')
    if (data.auth?.status === 'authenticated') await writeState(data.auth)
    safePrint(data)
    return
  }

  if (command === 'choose-new') {
    const data = await request('POST', '/api/skill/account/choose', { choice: 'new' })
    if (data.token) await writeState(data)
    safePrint(data)
    return
  }

  if (command === 'open') {
    const mode = args.mode || 'ensure'
    const body = mode === 'open'
      ? { mode, mindMapId: args.id }
      : { mode, title: args.title }
    if ((mode === 'open' && !body.mindMapId) || (mode !== 'open' && !body.title)) {
      throw new Error('open requires --id for mode=open, or --title for mode=create/ensure')
    }
    safePrint(await request('POST', '/api/skill/open', body))
    return
  }

  if (command === 'accept-invite') {
    if (!args.code) throw new Error('accept-invite requires --code <inviteCode>')
    safePrint(await request('POST', '/api/skill/accept-invite', { code: args.code }))
    return
  }

  if (command === 'get') {
    if (!args.id) throw new Error('get requires --id <mindMapId>')
    safePrint(await request('GET', `/api/mind-maps/${encodeURIComponent(args.id)}`))
    return
  }

  if (command === 'propose') {
    if (!args.file) throw new Error('propose requires --file proposal.json')
    const body = JSON.parse(await fs.readFile(args.file, 'utf8'))
    safePrint(await request('POST', '/api/skill/propose', body))
    return
  }

  if (command === 'watch') {
    if (!args.id) throw new Error('watch requires --id <mindMapId>')
    const state = await readState()
    if (!state.token) throw new Error('No stored Skill token. Run discover, then choose-new if needed.')
    const baseUrl = (process.env.XW_MINDMAP_API || DEFAULT_BASE_URL).replace(/\/+$/, '')
    const seconds = Number(args.seconds || 60)
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), Math.max(1, seconds) * 1000)
    try {
      const url = `${baseUrl}/api/skill/watch/${encodeURIComponent(args.id)}?token=${encodeURIComponent(state.token)}`
      const res = await fetch(url, { headers: { Accept: 'text/event-stream' }, signal: ac.signal })
      if (!res.ok || !res.body) throw new Error(`watch failed: ${res.status} ${res.statusText}`)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let idx
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const block = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 2)
          if (!block.trim() || block.startsWith(':')) continue
          console.log(block)
        }
      }
    } finally {
      clearTimeout(timer)
    }
    return
  }

  throw new Error(`Unknown command: ${command}`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
