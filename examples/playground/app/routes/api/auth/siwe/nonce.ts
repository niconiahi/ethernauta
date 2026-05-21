// SIWE step 1 — issue a one-shot nonce.
//
// The client POSTs here, gets back `{ nonce, domain, uri,
// issuedAt }`, builds a SIWE message from those + its own
// `chainId` + `address`, and asks the wallet to sign it.
// The matching value lives in the `siwe_nonce` HMAC cookie
// so the `/verify` action can pin the signed message to
// exactly this nonce and burn it.
//
// GET is intentionally not implemented — issuing a nonce
// is a side-effecting state mutation, and 405 surfaces
// CSRF-style misuse early.

import { generate_siwe_nonce } from "@ethernauta/eip/4361"

import type { Route } from "./+types/nonce"
import { set_nonce_cookie } from "../../../../lib/auth/session.server"

export async function action({
  request,
  context,
}: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 })
  }
  const nonce = generate_siwe_nonce()
  const url = new URL(request.url)
  const issuedAt = new Date().toISOString()
  const cookie = await set_nonce_cookie(
    { nonce, issuedAt },
    context.cloudflare.env,
    request,
  )
  return new Response(
    JSON.stringify({
      nonce,
      domain: url.host,
      uri: url.origin,
      issuedAt,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": cookie,
      },
    },
  )
}
