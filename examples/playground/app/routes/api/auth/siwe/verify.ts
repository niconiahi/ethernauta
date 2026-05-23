// SIWE step 2 — verify the signed message and mint a
// session.
//
// Body: `{ message, signature }`.
//
// Pipeline:
//   1. Read the `siwe_nonce` HMAC cookie issued by step 1.
//      No cookie ⇒ 401 — a nonce can't appear from thin
//      air, and we never accept a client-supplied nonce.
//   2. Resolve the reader against the chainId carried in
//      the message. The playground's reader covers a
//      hand-picked set of chains (`lib/auth/reader.server`);
//      anything outside it throws `no chain configured for`
//      which we surface as `unsupported_chain`.
//   3. Run `verify_siwe_message`, pinning the expected
//      domain (request host) and nonce (cookie) so a
//      message signed for another origin or with a stale
//      nonce is rejected even if the signature is
//      cryptographically valid.
//   4. Mint `siwe_session`, clear `siwe_nonce`. The same
//      response carries both Set-Cookie headers so the
//      client lands signed-in on the next navigation.

import { bytesSchema } from "@ethernauta/core"
import {
  parse_siwe_message,
  verify_siwe_message,
} from "@ethernauta/eip/4361"
import { encode_chain_id } from "@ethernauta/transport"
import { object, parse, string } from "valibot"
import { reader } from "../../../../lib/auth/reader.server"
import {
  clear_nonce_cookie,
  read_nonce_cookie,
  set_session_cookie,
} from "../../../../lib/auth/session.server"
import type { Route } from "./+types/verify"

const verifyBodySchema = object({
  message: string(),
  signature: bytesSchema,
})

export async function action({
  request,
  context,
}: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 })
  }
  const env = context.cloudflare.env
  const body = parse(verifyBodySchema, await request.json())
  const nonce = await read_nonce_cookie(request, env)
  if (!nonce) return json_error(401, "nonce_missing")
  const fields = parse_siwe_message(body.message)
  if (!fields) return json_error(400, "malformed_message")
  const reference = Number(fields.chainId)
  if (!Number.isInteger(reference)) {
    return json_error(400, "malformed_message")
  }
  let resolved: ReturnType<typeof reader>
  try {
    resolved = reader({
      chain_id: encode_chain_id({
        namespace: "eip155",
        reference,
      }),
    })
  } catch {
    return json_error(400, "unsupported_chain")
  }
  const url = new URL(request.url)
  const result = await verify_siwe_message({
    message: body.message,
    signature: body.signature,
    expected: {
      domain: url.host,
      nonce: nonce.nonce,
      chainId: fields.chainId,
    },
  })(resolved)
  if (!result.ok) {
    return new Response(
      JSON.stringify({ reason: result.reason }),
      {
        status: 401,
        headers: {
          "content-type": "application/json",
          "set-cookie": clear_nonce_cookie(),
        },
      },
    )
  }
  // Cookie outlives the SIWE `expirationTime` only when
  // the message omits one; in that case `read_session_cookie`
  // will reject on the 24h embedded fallback expiring first.
  const session_cookie = await set_session_cookie(
    {
      address: result.fields.address,
      chainId: result.fields.chainId,
      issuedAt: result.fields.issuedAt,
      expirationTime:
        result.fields.expirationTime ??
        new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toISOString(),
    },
    env,
    request,
  )
  return new Response(
    JSON.stringify({
      address: result.fields.address,
      chainId: result.fields.chainId,
    }),
    {
      status: 200,
      headers: new Headers([
        ["content-type", "application/json"],
        ["set-cookie", clear_nonce_cookie()],
        ["set-cookie", session_cookie],
      ]),
    },
  )
}

function json_error(
  status: number,
  reason: string,
): Response {
  return new Response(JSON.stringify({ reason }), {
    status,
    headers: { "content-type": "application/json" },
  })
}
