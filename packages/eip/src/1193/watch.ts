// https://eips.ethereum.org/EIPS/eip-1193#events
import {
  type Address,
  addressesSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

import type { Provider } from "./provider"

// Listen for `accountsChanged` from an EIP-1193 provider.
// Validates the payload against `addressesSchema` at the
// boundary — non-conforming announcements throw, surfacing
// wallet bugs instead of silently masking them. The
// returned function detaches the listener.
export function watch_accounts(
  _provider: Provider,
  _handler: (accounts: Address[]) => void,
): () => void {
  function inner(_payload: string[]) {
    const accounts = parse(addressesSchema, _payload)
    _handler(accounts)
  }
  _provider.on("accountsChanged", inner)
  return () => {
    _provider.removeListener("accountsChanged", inner)
  }
}

// Listen for `chainChanged`. The payload per EIP-1193 is
// a hex-quantity chain id (e.g. "0x1") — we forward it
// as-is. Callers that want CAIP-2 wrap with
// `encode_chain_id` themselves.
export function watch_chain(
  _provider: Provider,
  _handler: (chain_id: string) => void,
): () => void {
  function inner(payload: string) {
    _handler(payload)
  }
  _provider.on("chainChanged", inner)
  return () => {
    _provider.removeListener("chainChanged", inner)
  }
}
