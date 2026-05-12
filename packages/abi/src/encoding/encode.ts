import { keccak_256 } from "@noble/hashes/sha3"

export function to_selector(
  signature: string,
): Uint8Array {
  return keccak_256(
    new TextEncoder().encode(signature),
  ).slice(0, 4)
}

export function encode_address(
  value: `0x${string}`,
): Uint8Array {
  const result = new Uint8Array(32)
  const hex = value.slice(2)
  for (let i = 0; i < 20; i++) {
    result[12 + i] = Number.parseInt(
      hex.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  return result
}

export function encode_uint256(
  value: bigint,
): Uint8Array {
  const result = new Uint8Array(32)
  let v = value
  for (let i = 31; i >= 0; i--) {
    result[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return result
}

export function encode_string(
  value: string,
): Uint8Array {
  const bytes = new TextEncoder().encode(value)
  const padded_length =
    Math.ceil(bytes.length / 32) * 32
  const result = new Uint8Array(32 + padded_length)
  result.set(encode_uint256(BigInt(bytes.length)), 0)
  result.set(bytes, 32)
  return result
}

export function encode_call(
  signature: string,
  params: [`0x${string}`, string],
): Uint8Array {
  const selector = to_selector(signature)
  const encoded_address = encode_address(params[0])
  const encoded_string = encode_string(params[1])
  const offset = encode_uint256(64n)
  const result = new Uint8Array(
    4 + 32 + 32 + encoded_string.length,
  )
  result.set(selector, 0)
  result.set(encoded_address, 4)
  result.set(offset, 36)
  result.set(encoded_string, 68)
  return result
}
