import { strip_hex_prefix } from "./strip-hex-prefix"

const HEX_DECODE: Record<string, number> = {
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

export function hex_to_bytes(hex: string): Uint8Array {
  const data = strip_hex_prefix(hex)
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string")
  }
  const result = new Uint8Array(data.length / 2)
  for (let i = 0; i < data.length; i += 2) {
    const hi = HEX_DECODE[data[i] as string]
    const lo = HEX_DECODE[data[i + 1] as string]
    if (hi === undefined || lo === undefined) {
      throw new Error("Invalid hex character")
    }
    result[i / 2] = (hi << 4) | lo
  }
  return result
}
