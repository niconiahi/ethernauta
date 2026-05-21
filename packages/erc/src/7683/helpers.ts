// https://eips.ethereum.org/EIPS/eip-7683 — order builder helpers.

import type { Address, Hash32 } from "@ethernauta/core"

import type { GaslessCrossChainOrder } from "./types"

export type DeadlineWindow = {
  open_window_s: number
  fill_window_s: number
}

export function compute_deadlines(
  window: DeadlineWindow,
  now_s: number = Math.floor(Date.now() / 1000),
): { openDeadline: `0x${string}`; fillDeadline: `0x${string}` } {
  const open = now_s + window.open_window_s
  const fill = now_s + window.fill_window_s
  return {
    openDeadline: `0x${open.toString(16)}`,
    fillDeadline: `0x${fill.toString(16)}`,
  }
}

// Format addresses (20 bytes) as bytes32 by left-padding with
// zeros. Used by 7683 Output / FillInstruction fields, which
// carry token/recipient/settler as bytes32 so non-EVM chains
// can address into the same struct.
export function address_to_bytes32(
  _address: Address,
): Hash32 {
  const hex = _address.toLowerCase().slice(2)
  return `0x${hex.padStart(64, "0")}` as Hash32
}

// Pack a uint256 nonce as hex. Use `crypto.getRandomValues`
// for client-side uniqueness — settlers use the (user, nonce)
// pair to detect replays.
export function random_nonce(): `0x${string}` {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let hex = "0x"
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0")
  }
  return hex as `0x${string}`
}

// Strip leading zeros from a hex string except for `0x0`.
// EIP-712 numeric encoding tolerates either form, but some
// settler implementations strict-compare the on-chain stored
// nonce against the user-signed one.
export function strip_hex_zeros(
  hex: `0x${string}`,
): `0x${string}` {
  const stripped = hex.slice(2).replace(/^0+/, "")
  return `0x${stripped === "" ? "0" : stripped}` as `0x${string}`
}

export type GaslessOrderBuilder = {
  originSettler: Address
  user: Address
  originChainId: `0x${string}`
  orderDataType: Hash32
  orderData: `0x${string}`
  window: DeadlineWindow
  nonce?: `0x${string}`
}

export function build_gasless_order(
  input: GaslessOrderBuilder,
): GaslessCrossChainOrder {
  const { openDeadline, fillDeadline } = compute_deadlines(
    input.window,
  )
  return {
    originSettler: input.originSettler,
    user: input.user,
    nonce: input.nonce ?? random_nonce(),
    originChainId: input.originChainId,
    openDeadline,
    fillDeadline,
    orderDataType: input.orderDataType,
    orderData: input.orderData,
  }
}
