// SIWE sign-out — drop the `siwe_session` cookie. No body,
// no nonce, no signature: the session cookie is HttpOnly,
// so the only way to clear it from the browser is through
// a response we control.

import type { Route } from "./+types/logout"
import { clear_session_cookie } from "../../../../lib/auth/session.server"

export async function action({
  request,
}: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 })
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": clear_session_cookie(),
    },
  })
}
