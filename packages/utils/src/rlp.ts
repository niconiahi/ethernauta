// https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
// Recursive Length Prefix encoding. Used by every Ethereum
// transaction type for the canonical serialized form.

import { hex_to_bytes } from "./hex-to-bytes"

export type RlpInput =
  | string
  | number
  | bigint
  | Uint8Array
  | RlpInput[]

export function rlp_encode(input: RlpInput): Uint8Array {
  if (Array.isArray(input)) return encode_list(input)
  return encode_item(input)
}

function encode_item(
  item: string | number | bigint | Uint8Array,
): Uint8Array {
  const bytes = to_bytes(item)
  const first = bytes[0]
  if (
    bytes.length === 1 &&
    first !== undefined &&
    first < 0x80
  ) {
    return bytes
  }
  if (bytes.length <= 55) {
    const out = new Uint8Array(1 + bytes.length)
    out[0] = 0x80 + bytes.length
    out.set(bytes, 1)
    return out
  }
  const length_bytes = encode_length(bytes.length)
  const out = new Uint8Array(
    1 + length_bytes.length + bytes.length,
  )
  out[0] = 0xb7 + length_bytes.length
  out.set(length_bytes, 1)
  out.set(bytes, 1 + length_bytes.length)
  return out
}

function encode_list(list: RlpInput[]): Uint8Array {
  const items = list.map(rlp_encode)
  const total = items.reduce((s, i) => s + i.length, 0)
  if (total <= 55) {
    const out = new Uint8Array(1 + total)
    out[0] = 0xc0 + total
    let offset = 1
    for (const item of items) {
      out.set(item, offset)
      offset += item.length
    }
    return out
  }
  const length_bytes = encode_length(total)
  const out = new Uint8Array(
    1 + length_bytes.length + total,
  )
  out[0] = 0xf7 + length_bytes.length
  out.set(length_bytes, 1)
  let offset = 1 + length_bytes.length
  for (const item of items) {
    out.set(item, offset)
    offset += item.length
  }
  return out
}

function to_bytes(
  input: string | number | bigint | Uint8Array,
): Uint8Array {
  if (input instanceof Uint8Array) return input
  if (typeof input === "string") {
    if (input.startsWith("0x")) return hex_to_bytes(input)
    return new TextEncoder().encode(input)
  }
  return number_to_bytes(BigInt(input))
}

function number_to_bytes(big: bigint): Uint8Array {
  if (big === 0n) return new Uint8Array([])
  const hex = big.toString(16)
  const padded = hex.padStart(
    hex.length + (hex.length % 2),
    "0",
  )
  return hex_to_bytes(padded)
}

function encode_length(length: number): Uint8Array {
  if (length === 0) return new Uint8Array([])
  const out: number[] = []
  let temp = length
  while (temp > 0) {
    out.unshift(temp & 0xff)
    temp >>= 8
  }
  return new Uint8Array(out)
}
