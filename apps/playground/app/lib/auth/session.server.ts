// SIWE session glue — two HMAC-signed cookies on top of
// `cookie.server.ts`:
//
//   `siwe_nonce`   — short-lived (5 min). Issued by the
//                    `/api/auth/siwe/nonce` action. The
//                    matching `/verify` action reads it,
//                    pins the SIWE message's nonce field
//                    to it, then clears the cookie so a
//                    nonce can never be reused.
//   `siwe_session` — long-lived (24 h). Issued on a
//                    successful `/verify` and read by every
//                    route that wants to know who's signed
//                    in.
//
// All payloads are parsed back through Valibot on the read
// side so a tampered (but still HMAC-valid — impossible
// without the secret, but defensive) or stale-shape cookie
// surfaces as "no session" rather than a runtime crash.
//
// `Secure` is only set when the incoming request is https;
// `wrangler dev` serves plain http://localhost so leaving
// `Secure` on unconditionally would silently drop the
// cookie during local testing.

import { addressSchema } from "@ethernauta/core"
import {
  type InferOutput,
  isoTimestamp,
  object,
  parse,
  pipe,
  safeParse,
  string,
} from "valibot"

import {
  build_clear_cookie,
  build_set_cookie,
  read_cookie,
  sign_cookie_value,
  verify_cookie_value,
} from "./cookie.server"

export const NONCE_COOKIE = "siwe_nonce"
export const SESSION_COOKIE = "siwe_session"

const NONCE_MAX_AGE_SECONDS = 5 * 60
const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60

export const nonceCookieSchema = object({
  nonce: string(),
  issuedAt: pipe(string(), isoTimestamp()),
})
export type NonceCookie = InferOutput<
  typeof nonceCookieSchema
>

export const siweSessionSchema = object({
  address: addressSchema,
  chainId: string(),
  issuedAt: pipe(string(), isoTimestamp()),
  expirationTime: pipe(string(), isoTimestamp()),
})
export type SiweSession = InferOutput<
  typeof siweSessionSchema
>

function is_secure(request: Request): boolean {
  return new URL(request.url).protocol === "https:"
}

export function get_session_secret(env: Env): string {
  const secret = env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set it in wrangler.jsonc (dev) and as a Cloudflare secret (prod).",
    )
  }
  return secret
}

export async function set_nonce_cookie(
  _payload: NonceCookie,
  env: Env,
  request: Request,
): Promise<string> {
  const payload = parse(nonceCookieSchema, _payload)
  const value = await sign_cookie_value(
    payload,
    get_session_secret(env),
  )
  return build_set_cookie(NONCE_COOKIE, value, {
    max_age_seconds: NONCE_MAX_AGE_SECONDS,
    secure: is_secure(request),
  })
}

export async function read_nonce_cookie(
  request: Request,
  env: Env,
): Promise<NonceCookie | undefined> {
  const raw = read_cookie(request, NONCE_COOKIE)
  const verified = await verify_cookie_value<unknown>(
    raw,
    get_session_secret(env),
  )
  if (!verified) return undefined
  const result = safeParse(nonceCookieSchema, verified)
  return result.success ? result.output : undefined
}

export function clear_nonce_cookie(): string {
  return build_clear_cookie(NONCE_COOKIE)
}

export async function set_session_cookie(
  _payload: SiweSession,
  env: Env,
  request: Request,
): Promise<string> {
  const payload = parse(siweSessionSchema, _payload)
  const value = await sign_cookie_value(
    payload,
    get_session_secret(env),
  )
  return build_set_cookie(SESSION_COOKIE, value, {
    max_age_seconds: SESSION_MAX_AGE_SECONDS,
    secure: is_secure(request),
  })
}

export async function read_session_cookie(
  request: Request,
  env: Env,
): Promise<SiweSession | undefined> {
  const raw = read_cookie(request, SESSION_COOKIE)
  const verified = await verify_cookie_value<unknown>(
    raw,
    get_session_secret(env),
  )
  if (!verified) return undefined
  const result = safeParse(siweSessionSchema, verified)
  if (!result.success) return undefined
  // Defense in depth: a long-lived session cookie may have
  // outlived the SIWE expirationTime field it embeds.
  // Treat that as "no session" rather than trusting the
  // cookie's longer Max-Age.
  if (
    new Date(result.output.expirationTime).getTime() <=
    Date.now()
  ) {
    return undefined
  }
  return result.output
}

export function clear_session_cookie(): string {
  return build_clear_cookie(SESSION_COOKIE)
}
