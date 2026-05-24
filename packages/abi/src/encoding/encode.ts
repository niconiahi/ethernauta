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
  _args: readonly AbiCodec<any>[],
): string {
  return `${_name}(${_args.map((a) => a.signature).join(",")})`
}

// 4-byte function selector derived from typed args.
export function function_selector(
  _name: string,
  _args: readonly AbiCodec<any>[],
): `0x${string}` {
  return bytes_to_hex(
    to_selector(build_signature(_name, _args)),
  )
}

// TODO(R0.2): this signature is the loose-intermediate form. The
// strict form mandated by R0.2 is:
//
//   function encode_function_call<Args extends readonly unknown[]>(_input: {
//     name: string
//     args: { readonly [K in keyof Args]: AbiCodec<Args[K]> }
//     values: Args
//   }): Uint8Array
//
// Tightening it requires the C2 codegen-side work (Phase 5): the
// `values` extraction in generated method files must produce a value
// whose static type matches `Args` derived from PARAM_CODECS — today
// the parametersSchema's union(tuple | object) yields a wider shape,
// which is why this signature still accepts `readonly unknown[]`.
// Encode a function call: 4-byte selector + ABI-encoded arguments.
// `args` is the typed codec list; `values` is the runtime tuple whose
// shape MUST match `args`. The previous mapped-tuple version was
// always cast to `unknown[]` internally (decorative, not enforcing) —
// the call-site `values as never` it forced was a worse outcome than
// today's looser-but-honest signature.
export function encode_function_call(_input: {
  name: string
  args: readonly AbiCodec<any>[]
  values: readonly unknown[]
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

// TODO(R0.2): same loose-intermediate form as `encode_function_call`
// above. The strict form (`<Args>` plus mapped-tuple codecs) is the
// target; today's `AbiCodec<any>[]` + `unknown[]` will tighten when
// the C2 codegen-side work lands in Phase 5.
// Build creation calldata for a deploy transaction: contract bytecode
// concatenated with ABI-encoded constructor arguments. Pass an empty
// `args`/`values` tuple for constructors with no arguments.
export function encode_constructor_call(_input: {
  bytecode: Uint8Array
  args: readonly AbiCodec<any>[]
  values: readonly unknown[]
}): Uint8Array {
  const { bytecode, args, values } = _input
  const body = encode_sequence(args, values)
  const out = new Uint8Array(bytecode.length + body.length)
  out.set(bytecode, 0)
  out.set(body, bytecode.length)
  return out
}
