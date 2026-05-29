// https://docs.ens.domains/ensip/10

import { type Bytes, BytesSchema } from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

// DNS wire-format encoding used by ENSIP-10's
// `resolve(bytes name, bytes data)`. Each dot-separated
// label is prefixed with its UTF-8 byte length and the
// full name is terminated with a 0x00 root label.
//
// The single-byte length prefix caps labels at 63 bytes
// (the upper two bits 0xc0 are reserved for DNS message
// compression, which ENSIP-10 forbids).
export function dns_encode(_name: string): Bytes {
  if (_name.length === 0) {
    return parse(BytesSchema, "0x00")
  }
  const labels = _name.split(".")
  const encoder = new TextEncoder()
  const encoded_labels = labels.map((label) => {
    const bytes = encoder.encode(label)
    if (bytes.length === 0) {
      throw new Error("dns_encode: empty label")
    }
    if (bytes.length > 63) {
      throw new Error(
        `dns_encode: label "${label}" exceeds 63 bytes`,
      )
    }
    return bytes
  })
  const total =
    encoded_labels.reduce(
      (sum, b) => sum + 1 + b.length,
      0,
    ) + 1
  const out = new Uint8Array(total)
  let offset = 0
  for (const bytes of encoded_labels) {
    out[offset] = bytes.length
    out.set(bytes, offset + 1)
    offset += 1 + bytes.length
  }
  out[offset] = 0
  return parse(BytesSchema, bytes_to_hex(out))
}
