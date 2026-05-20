import { keccak_256 } from "@noble/hashes/sha3"
import { bytes_to_hex } from "@ethernauta/utils"

import type { AbiCodec } from "../abi-codec"
import { encode_sequence } from "../sequence"

export function to_selector(_signature: string): Uint8Array {
  return keccak_256(
    new TextEncoder().encode(_signature),
  ).slice(0, 4)
}

// Build the canonical solidity signature string by walking the codec
// tree. Never typed by hand.
export function build_signature(
  _name: string,
  _args: readonly AbiCodec<unknown>[],
): string {
  return `${_name}(${_args.map((a) => a.signature).join(",")})`
}

// 4-byte function selector derived from typed args.
export function function_selector(
  _name: string,
  _args: readonly AbiCodec<unknown>[],
): `0x${string}` {
  return bytes_to_hex(to_selector(build_signature(_name, _args)))
}

type ValuesOf<Args extends readonly AbiCodec<unknown>[]> = {
  [K in keyof Args]: Args[K] extends AbiCodec<infer T>
    ? T
    : never
}

// Encode a function call: 4-byte selector + ABI-encoded arguments.
// Args is a readonly tuple of typed codecs; `values` is positionally
// inferred from each codec's T.
export function encode_function_call<
  Args extends readonly AbiCodec<unknown>[],
>(_input: {
  name: string
  args: Args
  values: ValuesOf<Args>
}): Uint8Array {
  const { name, args, values } = _input
  const signature = build_signature(name, args)
  const selector = to_selector(signature)
  const body = encode_sequence(
    args,
    values as readonly unknown[],
  )
  const out = new Uint8Array(4 + body.length)
  out.set(selector, 0)
  out.set(body, 4)
  return out
}
