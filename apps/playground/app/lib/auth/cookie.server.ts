// HMAC-SHA256-signed cookies, payload-as-JSON.
//
// Format on the wire: `<base64url(payload)>.<base64url(hmac)>`
// — stateless, no KV needed. Works on any Web Crypto host
// (Cloudflare Workers, Node 20+, browsers if we ever need
// it for a non-secure prototype).
//
// Constant-time comparison on verify so we don't leak the
// signature byte-by-byte through a timing channel.

const ENCODER = new TextEncoder()
const DECODER = new TextDecoder()

function base64url_encode(bytes: Uint8Array): string {
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function base64url_decode(value: string): Uint8Array {
  const padded =
    value.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function import_key(
  secret: string,
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

function constant_time_equal(
  a: Uint8Array,
  b: Uint8Array,
): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= (a[i] as number) ^ (b[i] as number)
  }
  return diff === 0
}

export async function sign_cookie_value(
  payload: unknown,
  secret: string,
): Promise<string> {
  const body = base64url_encode(
    ENCODER.encode(JSON.stringify(payload)),
  )
  const key = await import_key(secret)
  const mac = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      ENCODER.encode(body),
    ),
  )
  return `${body}.${base64url_encode(mac)}`
}

export async function verify_cookie_value<T>(
  raw: string | undefined,
  secret: string,
): Promise<T | undefined> {
  if (!raw) return undefined
  const dot = raw.indexOf(".")
  if (dot === -1) return undefined
  const body = raw.slice(0, dot)
  const signature = raw.slice(dot + 1)
  const key = await import_key(secret)
  const expected = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      ENCODER.encode(body),
    ),
  )
  const actual = base64url_decode(signature)
  if (!constant_time_equal(expected, actual)) {
    return undefined
  }
  try {
    return JSON.parse(
      DECODER.decode(base64url_decode(body)),
    ) as T
  } catch {
    return undefined
  }
}

// Minimal Cookie header parser — only what we need for
// reading our own cookies off an incoming Request.
export function read_cookie(
  request: Request,
  name: string,
): string | undefined {
  const header = request.headers.get("cookie")
  if (!header) return undefined
  for (const part of header.split(";")) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    if (trimmed.slice(0, eq) !== name) continue
    return decodeURIComponent(trimmed.slice(eq + 1))
  }
  return undefined
}

export type SetCookieOptions = {
  max_age_seconds: number
  same_site?: "Lax" | "Strict" | "None"
  secure?: boolean
  path?: string
}

export function build_set_cookie(
  name: string,
  value: string,
  options: SetCookieOptions,
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${options.path ?? "/"}`,
    "HttpOnly",
    `SameSite=${options.same_site ?? "Lax"}`,
    `Max-Age=${options.max_age_seconds}`,
  ]
  if (options.secure !== false) parts.push("Secure")
  return parts.join("; ")
}

export function build_clear_cookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`
}
