// @ts-nocheck
export function bytes_to_hex(
  data: Uint8Array,
): `0x${string}` {
  let result = ""
  for (let i = 0; i < data.length; i++) {
    result += ALPHABET[data[i] >> 4]
    result += ALPHABET[data[i] & 0x0f]
  }
  return `0x${result}`
}

export function strip_hex_prefix(hex: string): string {
  return hex.startsWith("0x") ? hex.substring(2) : hex
}

export function hex_to_bytes(hex: string): Uint8Array {
  const data = strip_hex_prefix(hex)
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string")
  }
  const result = new Uint8Array(data.length / 2)
  for (let i = 0; i < data.length; i += 2) {
    if (!(data[i] in decodeMap)) {
      throw new Error("Invalid character")
    }
    if (!(data[i + 1] in decodeMap)) {
      throw new Error("Invalid character")
    }
    result[i / 2] |= decodeMap[data[i]] << 4
    result[i / 2] |= decodeMap[data[i + 1]]
  }
  return result
}

const ALPHABET = "0123456789abcdef"

const decodeMap: Record<string, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15,
}
