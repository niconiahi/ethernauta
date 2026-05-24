import { bytes_to_hex } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"

import type { AbiCodec } from "../abi-codec"
import { encode_sequence } from "../sequence"

export function to_selector(
  _signature: string,
): Uint8Array {
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
  return bytes_to_hex(
    to_selector(build_signature(_name, _args)),
  )
}

// Encode a function call: 4-byte selector + ABI-encoded arguments.
// `args` is the typed codec list; `values` is the runtime tuple whose
// per-position type must match the corresponding codec's `T`. The
// strict generic form (per R0.2) keys `values` to `args` through the
// shared `Args` parameter — call sites do not need an `as` to bridge
// the two. `NoInfer<Args>` keeps the inference site on the codec
// tuple; otherwise literal hex values would drive Args to their
// narrow literal type and the codecs would fail to match.
export function encode_function_call<
  Args extends readonly unknown[],
>(_input: {
  name: string
  args: { readonly [K in keyof Args]: AbiCodec<Args[K]> }
  values: NoInfer<Args>
}): Uint8Array {
  const { name, args, values } = _input
  const signature = build_signature(name, args)
  const selector = to_selector(signature)
  const body = encode_sequence(args, values)
  const out = new Uint8Array(4 + body.length)
  out.set(selector, 0)
  out.set(body, 4)
  return out
}

// Build creation calldata for a deploy transaction: contract bytecode
// concatenated with ABI-encoded constructor arguments. Pass an empty
// `args`/`values` tuple for constructors with no arguments. Same
// strict generic form as `encode_function_call` — `Args` ties the
// codec list to the runtime tuple, and `NoInfer<Args>` keeps the
// inference site on the codec tuple.
export function encode_constructor_call<
  Args extends readonly unknown[],
>(_input: {
  bytecode: Uint8Array
  args: { readonly [K in keyof Args]: AbiCodec<Args[K]> }
  values: NoInfer<Args>
}): Uint8Array {
  const { bytecode, args, values } = _input
  const body = encode_sequence(args, values)
  const out = new Uint8Array(bytecode.length + body.length)
  out.set(bytecode, 0)
  out.set(body, bytecode.length)
  return out
}
