import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"

import type { AbiCodec } from "../abi-codec"
import { decode_sequence } from "../sequence"

// Per-position decoded value: extract each codec's element type. With
// bivariant `AbiCodec<T>` (method shorthand on encode/decode), an
// `AbiCodec<string>` is structurally assignable to `AbiCodec<unknown>`
// — so call sites pass their typed tuple directly without an `as`.
type DecodedOf<Args extends readonly AbiCodec<unknown>[]> =
  {
    readonly [K in keyof Args]: Args[K] extends AbiCodec<
      infer T
    >
      ? T
      : never
  }

// Decode an ABI-encoded payload (e.g., an `eth_call` return) into a
// typed tuple of values, one per codec in `_args`. The decode invariant
// (each codec returns its declared T) is the contract; TS can't
// express that through a `.entries()` accumulator, so the result is
// re-typed at the boundary via the mapped `DecodedOf<Args>` shape.
export function decode_function_result<
  const Args extends readonly AbiCodec<unknown>[],
>(_args: Args, _hex: `0x${string}`): DecodedOf<Args> {
  const data = hex_to_bytes(_hex)
  const decoded = decode_sequence(_args, data, 0)
  // allow-violation: R1-mapped-tuple
  return decoded as DecodedOf<Args>
}

// Decode a complete calldata (selector + args).
export function decode_function_call<
  const Args extends readonly AbiCodec<unknown>[],
>(
  _args: Args,
  _hex: `0x${string}`,
): {
  selector: `0x${string}`
  args: DecodedOf<Args>
} {
  const data = hex_to_bytes(_hex)
  if (data.length < 4) {
    throw new Error(
      `calldata too short: ${data.length} bytes`,
    )
  }
  const selector = bytes_to_hex(data.slice(0, 4))
  const body = data.slice(4)
  const decoded = decode_sequence(_args, body, 0)
  // allow-violation: R1-mapped-tuple
  const args = decoded as DecodedOf<Args>
  return { selector, args }
}
