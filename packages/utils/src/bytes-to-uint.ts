import { bytes_to_hex } from "./bytes-to-hex"

export function bytes_to_uint(
  bytes: Uint8Array,
): `0x${string}` {
  if (bytes.length === 0) return "0x0"
  const n = BigInt(bytes_to_hex(bytes))
  return `0x${n.toString(16)}`
}
