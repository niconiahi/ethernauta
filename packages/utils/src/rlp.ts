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

// RLP only preserves bytes and nesting — numbers and strings
// fed into `rlp_encode` come back as byte payloads. Callers
// reapply meaning (number, address, hash, …) from the
// surrounding schema.
export type RlpDecoded = Uint8Array | RlpDecoded[]

export function rlp_decode(bytes: Uint8Array): RlpDecoded {
  const [value, consumed] = decode_item(bytes, 0)
  if (consumed !== bytes.length) {
    throw new Error(
      `rlp_decode: ${bytes.length - consumed} trailing byte(s)`,
    )
  }
  return value
}

function decode_item(
  bytes: Uint8Array,
  offset: number,
): [RlpDecoded, number] {
  if (offset >= bytes.length) {
    throw new Error("rlp_decode: unexpected end of input")
  }
  const prefix = bytes[offset]
  if (prefix === undefined) {
    throw new Error("rlp_decode: unexpected end of input")
  }
  if (prefix < 0x80) {
    return [bytes.slice(offset, offset + 1), 1]
  }
  if (prefix <= 0xb7) {
    const length = prefix - 0x80
    const start = offset + 1
    const end = start + length
    assert_in_bounds(bytes, end)
    return [bytes.slice(start, end), 1 + length]
  }
  if (prefix <= 0xbf) {
    const length_of_length = prefix - 0xb7
    const length_start = offset + 1
    const length_end = length_start + length_of_length
    assert_in_bounds(bytes, length_end)
    const length = read_length(
      bytes.subarray(length_start, length_end),
    )
    const start = length_end
    const end = start + length
    assert_in_bounds(bytes, end)
    return [
      bytes.slice(start, end),
      1 + length_of_length + length,
    ]
  }
  if (prefix <= 0xf7) {
    const length = prefix - 0xc0
    const start = offset + 1
    const end = start + length
    assert_in_bounds(bytes, end)
    return [
      decode_list_payload(bytes, start, end),
      1 + length,
    ]
  }
  const length_of_length = prefix - 0xf7
  const length_start = offset + 1
  const length_end = length_start + length_of_length
  assert_in_bounds(bytes, length_end)
  const length = read_length(
    bytes.subarray(length_start, length_end),
  )
  const start = length_end
  const end = start + length
  assert_in_bounds(bytes, end)
  return [
    decode_list_payload(bytes, start, end),
    1 + length_of_length + length,
  ]
}

function decode_list_payload(
  bytes: Uint8Array,
  start: number,
  end: number,
): RlpDecoded[] {
  const items: RlpDecoded[] = []
  let cursor = start
  while (cursor < end) {
    const [value, consumed] = decode_item(bytes, cursor)
    items.push(value)
    cursor += consumed
  }
  if (cursor !== end) {
    throw new Error(
      "rlp_decode: list payload length mismatch",
    )
  }
  return items
}

function read_length(bytes: Uint8Array): number {
  let length = 0
  for (const byte of bytes) {
    length = length * 0x100 + byte
  }
  return length
}

function assert_in_bounds(
  bytes: Uint8Array,
  end: number,
): void {
  if (end > bytes.length) {
    throw new Error("rlp_decode: payload overruns input")
  }
}
