import { invariant } from "@ethernauta/utils"

import type { AbiCodec } from "./abi-codec"

// Encode a positional sequence of typed values using the solidity
// head/tail rule.
//
// Head region: one 32-byte slot per item. For static items, the slot
// holds the inline encoded value. For dynamic items, the slot holds a
// 32-byte offset (relative to the start of the head region) pointing
// to the item's encoded body in the tail region.
//
// Tail region: concatenated bodies of all dynamic items, in order.
//
// Used both at the function-call top level and inside tuples. Codecs
// are typed at `AbiCodec<unknown>`; method-shorthand bivariance in
// `AbiCodec<T>` lets narrower codec lists pass without an `as`.
export function encode_sequence(
  _codecs: readonly AbiCodec<unknown>[],
  _values: readonly unknown[],
): Uint8Array {
  if (_codecs.length !== _values.length) {
    throw new Error(
      `sequence length mismatch: ${_codecs.length} codecs vs ${_values.length} values`,
    )
  }
  const head_size = _codecs.length * 32
  const heads: Uint8Array[] = []
  const tails: Uint8Array[] = []
  for (const [i, codec] of _codecs.entries()) {
    const value = _values[i]
    if (codec.is_dynamic) {
      heads.push(new Uint8Array(32))
      tails.push(codec.encode(value))
    } else {
      heads.push(codec.encode(value))
      tails.push(new Uint8Array(0))
    }
  }
  let offset = head_size
  for (const [i, codec] of _codecs.entries()) {
    if (codec.is_dynamic) {
      heads[i] = write_uint256(BigInt(offset))
      const tail = tails[i]
      invariant(tail, "tail must exist at codec index")
      offset += tail.length
    }
  }
  const total =
    head_size + tails.reduce((sum, t) => sum + t.length, 0)
  const out = new Uint8Array(total)
  let pos = 0
  for (const head of heads) {
    out.set(head, pos)
    pos += 32
  }
  for (const tail of tails) {
    if (tail.length === 0) continue
    out.set(tail, pos)
    pos += tail.length
  }
  return out
}

// Decode the inverse of `encode_sequence`. `_base` is the byte index
// where the head region begins.
export function decode_sequence(
  _codecs: readonly AbiCodec<unknown>[],
  _data: Uint8Array,
  _base: number,
): unknown[] {
  const out: unknown[] = []
  for (const [i, codec] of _codecs.entries()) {
    const head_pos = _base + i * 32
    if (codec.is_dynamic) {
      const offset = Number(read_uint256(_data, head_pos))
      out.push(codec.decode(_data, _base + offset))
    } else {
      out.push(codec.decode(_data, head_pos))
    }
  }
  return out
}

function read_uint256(
  _data: Uint8Array,
  _pos: number,
): bigint {
  let value = 0n
  for (let i = 0; i < 32; i++) {
    const byte = _data[_pos + i]
    invariant(
      byte !== undefined,
      "uint256 read out of bounds",
    )
    value = (value << 8n) | BigInt(byte)
  }
  return value
}

function write_uint256(_value: bigint): Uint8Array {
  const result = new Uint8Array(32)
  let v = _value
  for (let i = 31; i >= 0; i--) {
    result[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return result
}
