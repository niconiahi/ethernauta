// https://eips.ethereum.org/EIPS/eip-5564 — Announcement event.
//
// event Announcement(
//   uint256 indexed schemeId,
//   address indexed stealthAddress,
//   address indexed caller,
//   bytes ephemeralPubKey,
//   bytes metadata
// )
//
// `metadata[0]` carries the view tag; the rest is
// scheme-defined free-form data (e.g. an ERC-20 transfer
// descriptor).

import {
  type Bytes,
  bytesSchema,
  type Hash32,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { type InferOutput, number, object } from "valibot"

const EVENT_SIGNATURE =
  "Announcement(uint256,address,address,bytes,bytes)"

export const ANNOUNCEMENT_EVENT_TOPIC: Hash32 = (() => {
  const hash = keccak_256(
    new TextEncoder().encode(EVENT_SIGNATURE),
  )
  return bytes_to_hex(hash) as Hash32
})()

export const metadataSchema = object({
  view_tag: number(),
  body: bytesSchema,
})
export type Metadata = InferOutput<typeof metadataSchema>

export function encode_metadata({
  view_tag,
  body,
}: Metadata): Bytes {
  const body_bytes = hex_to_bytes(body as `0x${string}`)
  const out = new Uint8Array(1 + body_bytes.length)
  out[0] = view_tag & 0xff
  out.set(body_bytes, 1)
  return bytes_to_hex(out) as Bytes
}

export function decode_metadata(_bytes: Bytes): Metadata {
  const buf = hex_to_bytes(_bytes as `0x${string}`)
  if (buf.length === 0) {
    return { view_tag: 0, body: "0x" as Bytes }
  }
  return {
    view_tag: buf[0] ?? 0,
    body: bytes_to_hex(buf.slice(1)) as Bytes,
  }
}

// View-tag pre-filter: cheap check against a single byte
// before the costly stealth-address rederivation. Skips
// roughly 255/256 of irrelevant announcements.
export function view_tag_matches(
  expected: number,
  announced: number,
): boolean {
  return (expected & 0xff) === (announced & 0xff)
}
