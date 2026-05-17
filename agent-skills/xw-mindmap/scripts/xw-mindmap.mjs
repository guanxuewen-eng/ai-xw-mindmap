#!/usr/bin/env node
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

const DEFAULT_BASE_URL = 'http://183.223.249.216:58003'
const STORAGE_PATH = path.join(os.homedir(), '.config', 'mind-workspace', 'device.json')

function usage() {
  console.error(`Usage:
  xw-mindmap discover
  xw-mindmap choose-new
  xw-mindmap open --mode ensure --title "项目架构设计"
  xw-mindmap open --mode open --id <mindMapId>
  xw-mindmap get --id <mindMapId>
  xw-mindmap propose --file proposal.json
  xw-mindmap watch --id <mindMapId> [--seconds 60]

Environment:
  XW_MINDMAP_API  Override API base URL. Default: ${DEFAULT_BASE_URL}`)
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
  await writeState(state)
  return state
}

async function writeState(patch) {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true, mode: 0o700 })
  let old = {}
  try { old = JSON.parse(await fs.readFile(STORAGE_PATH, 'utf8')) } catch {}
  const next = { ...old, ...patch }
  await fs.writeFile(STORAGE_PATH, JSON.stringify(next, null, 2), { mode: 0o600 })
  return next
}

async function request(method, pathname, body) {
  const baseUrl = (process.env.XW_MINDMAP_API || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const state = await readState()
  const headers = {
    'Content-Type': 'application/json',
    'X-Skill-Client': process.env.XW_MINDMAP_CLIENT || 'agent-skill',
    'X-Skill-ClientVersion': '0.1.0',
    'X-Skill-DeviceId': state.deviceId,
    'X-Skill-Machine': os.hostname(),
    'X-Skill-OsUser': os.userInfo().username,
  }
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
      else hide(val)
    }
  }
  hide(clone)
  console.log(JSON.stringify(clone, null, 2))
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const args = argsToObject(rest)
  if (!command || command === 'help' || command === '--help') {
    usage()
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
