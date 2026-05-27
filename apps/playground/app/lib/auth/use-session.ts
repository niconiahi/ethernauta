// Client-side accessor for the SIWE session that the root
// loader puts on every request. Returns `null` when the
// visitor hasn't signed in yet — demos render a hint
// pointing at the header's Connect wallet button in that
// case.

import { useRouteLoaderData } from "react-router"

import type { loader as rootLoader } from "../../root"

export function use_session() {
  const data = useRouteLoaderData<typeof rootLoader>("root")
  return data?.session ?? null
}
