import type { BaseIssue, BaseSchema } from "valibot"

// Codec node for a single ABI type. Composable: tuple/array build bigger
// codecs from smaller ones. The signature fragment is auto-derived from
// the tree so the canonical solidity signature is never hand-written.
export type AbiCodec<T> = {
  signature: string
  is_dynamic: boolean
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>
  encode: (_value: T) => Uint8Array
  // `pos` is the byte index where this value's encoded data starts.
  // For static types: pos points at the inline 32-byte slot.
  // For dynamic types: pos points at the start of the length-prefixed body
  // (the caller resolves any out-of-line offset before calling decode).
  decode: (_data: Uint8Array, _pos: number) => T
}

export type InferCodec<C> =
  C extends AbiCodec<infer T> ? T : never
