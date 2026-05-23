// Minimal ABI codec for the `(address, bytes, bytes)`
// triple used by ERC-6492 (wrap arguments) and by the
// universal-validator constructor signature `(address,
// bytes32, bytes)`. Hand-rolled to keep this package free
// of an @ethernauta/abi dependency, mirroring how 4337
// builds its own packing.

import { hex_to_bytes } from "@ethernauta/utils"

const WORD = 32

export function pad_word(_bytes: Uint8Array): Uint8Array {
  if (_bytes.length === WORD) return _bytes
  if (_bytes.length > WORD) {
    throw new Error(
      `pad_word: input is ${_bytes.length} bytes, expected <= ${WORD}`,
    )
  }
  const out = new Uint8Array(WORD)
  out.set(_bytes, WORD - _bytes.length)
  return out
}

export function pad_data(_bytes: Uint8Array): Uint8Array {
  const len = Math.ceil(_bytes.length / WORD) * WORD
  if (len === _bytes.length) return _bytes
  const out = new Uint8Array(len)
  out.set(_bytes, 0)
  return out
}

export function uint256_be(_value: number): Uint8Array {
  const out = new Uint8Array(WORD)
  let v = _value
  for (let i = 0; i < 8 && v > 0; i++) {
    out[WORD - 1 - i] = v & 0xff
    v >>>= 8
  }
  return out
}

export function read_uint256(
  _bytes: Uint8Array,
  _offset: number,
): number {
  // Off-chain consumers only encounter lengths and offsets
  // within this codec — small enough that returning a
  // regular number is fine. Anything wider than 2^53 would
  // already have torn calldata budgets.
  let n = 0
  for (let i = 0; i < WORD; i++) {
    n = n * 256 + (_bytes[_offset + i] as number)
    if (n > Number.MAX_SAFE_INTEGER) {
      throw new Error(
        "abi: word does not fit in safe integer",
      )
    }
  }
  return n
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  let total = 0
  for (const p of parts) total += p.length
  const out = new Uint8Array(total)
  let off = 0
  for (const p of parts) {
    out.set(p, off)
    off += p.length
  }
  return out
}

export function encode_address_bytes_bytes(
  _address: `0x${string}`,
  _first: `0x${string}`,
  _second: `0x${string}`,
): Uint8Array {
  const address_bytes = pad_word(hex_to_bytes(_address))
  const first_bytes = hex_to_bytes(_first)
  const second_bytes = hex_to_bytes(_second)
  const offset_first = 3 * WORD
  const offset_second =
    offset_first +
    WORD +
    Math.ceil(first_bytes.length / WORD) * WORD
  const head = concat([
    address_bytes,
    uint256_be(offset_first),
    uint256_be(offset_second),
  ])
  const first_tail = concat([
    uint256_be(first_bytes.length),
    pad_data(first_bytes),
  ])
  const second_tail = concat([
    uint256_be(second_bytes.length),
    pad_data(second_bytes),
  ])
  return concat([head, first_tail, second_tail])
}

export function encode_address_bytes32_bytes(
  _address: `0x${string}`,
  _hash: `0x${string}`,
  _signature: `0x${string}`,
): Uint8Array {
  const address_bytes = pad_word(hex_to_bytes(_address))
  const hash_bytes = hex_to_bytes(_hash)
  if (hash_bytes.length !== WORD) {
    throw new Error(
      `expected 32-byte hash, got ${hash_bytes.length}`,
    )
  }
  const sig_bytes = hex_to_bytes(_signature)
  // head = address(32) + hash(32) + offset(32) = 96
  const offset_sig = 3 * WORD
  const head = concat([
    address_bytes,
    hash_bytes,
    uint256_be(offset_sig),
  ])
  const sig_tail = concat([
    uint256_be(sig_bytes.length),
    pad_data(sig_bytes),
  ])
  return concat([head, sig_tail])
}

export type DecodedAddressBytesBytes = {
  readonly address: Uint8Array
  readonly first: Uint8Array
  readonly second: Uint8Array
}

export function decode_address_bytes_bytes(
  _bytes: Uint8Array,
): DecodedAddressBytesBytes {
  if (_bytes.length < 3 * WORD) {
    throw new Error(
      "abi: input too short for (address, bytes, bytes) head",
    )
  }
  const address = _bytes.subarray(12, WORD)
  const offset_first = read_uint256(_bytes, WORD)
  const offset_second = read_uint256(_bytes, 2 * WORD)
  if (
    offset_first + WORD > _bytes.length ||
    offset_second + WORD > _bytes.length
  ) {
    throw new Error("abi: offset out of range")
  }
  const first_len = read_uint256(_bytes, offset_first)
  const second_len = read_uint256(_bytes, offset_second)
  const first_start = offset_first + WORD
  const second_start = offset_second + WORD
  if (
    first_start + first_len > _bytes.length ||
    second_start + second_len > _bytes.length
  ) {
    throw new Error("abi: dynamic data out of range")
  }
  return {
    address,
    first: _bytes.subarray(
      first_start,
      first_start + first_len,
    ),
    second: _bytes.subarray(
      second_start,
      second_start + second_len,
    ),
  }
}
