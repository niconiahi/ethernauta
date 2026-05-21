import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"

import type { AbiCodec } from "../abi-codec"
import { decode_sequence } from "../sequence"

type ValuesOf<Args extends readonly AbiCodec<any>[]> = {
  [K in keyof Args]: Args[K] extends AbiCodec<infer T>
    ? T
    : never
}

// Decode an ABI-encoded payload (e.g., an `eth_call` return) into a
// typed tuple of values, one per codec in `_args`.
export function decode_function_result<
  Args extends readonly AbiCodec<any>[],
>(_args: Args, _hex: `0x${string}`): ValuesOf<Args> {
  const data = hex_to_bytes(_hex)
  return decode_sequence(_args, data, 0) as ValuesOf<Args>
}

// Decode a complete calldata (selector + args).
export function decode_function_call<
  Args extends readonly AbiCodec<any>[],
>(
  _args: Args,
  _hex: `0x${string}`,
): {
  selector: `0x${string}`
  args: ValuesOf<Args>
} {
  const data = hex_to_bytes(_hex)
  if (data.length < 4) {
    throw new Error(
      `calldata too short: ${data.length} bytes`,
    )
  }
  const selector = bytes_to_hex(data.slice(0, 4))
  const body = data.slice(4)
  const args = decode_sequence(_args, body, 0)
  return { selector, args: args as ValuesOf<Args> }
}
