// https://eips.ethereum.org/EIPS/eip-6492

import type { Bytes } from "@ethernauta/core"
import { bytesSchema } from "@ethernauta/core"
import { hex_to_bytes } from "@ethernauta/utils"
import { parse } from "valibot"

import { MAGIC_BYTES } from "./magic-bytes"

// True iff the signature ends with the 32-byte 6492
// magic suffix. Pure check on the bytes — no decoding,
// no schema beyond the generic `bytes`.
export function is_wrapped_signature(
  _signature: Bytes,
): boolean {
  const signature = parse(bytesSchema, _signature)
  const bytes = hex_to_bytes(signature)
  if (bytes.length < 32) return false
  const suffix = bytes.subarray(bytes.length - 32)
  const magic = hex_to_bytes(MAGIC_BYTES)
  for (let i = 0; i < 32; i++) {
    if (suffix[i] !== magic[i]) return false
  }
  return true
}
