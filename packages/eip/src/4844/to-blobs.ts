// https://eips.ethereum.org/EIPS/eip-4844
//
// Application-level blob encoding. EIP-4844 specifies WHAT a blob is
// (4096 field elements, each strictly less than BLS_MODULUS) but NOT
// how to encode arbitrary bytes into one — that is up to the consumer.
//
// We follow viem's convention so dapps moving between libraries get
// the same bytes:
//   - prepend a 4-byte big-endian length header
//   - split the (header + data) stream into 31-byte chunks
//   - prepend 0x00 to each chunk, giving a 32-byte field element whose
//     high byte is zero (guaranteeing < BLS_MODULUS)
//   - pack 4096 field elements per blob; zero-pad the tail of the last
//     blob if needed
//
// `from_blobs` is the inverse — reads the length header from the first
// blob and slices out the original byte stream.
import { type Bytes, BytesSchema } from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"

import {
  BYTES_PER_BLOB,
  BYTES_PER_FIELD_ELEMENT,
  FIELD_ELEMENTS_PER_BLOB,
} from "./constants"
import { type Blob, BlobSchema } from "./schemas"

const DATA_BYTES_PER_FIELD_ELEMENT =
  BYTES_PER_FIELD_ELEMENT - 1 // 31 — leave room for the leading 0x00
const DATA_BYTES_PER_BLOB =
  DATA_BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB
const HEADER_BYTES = 4

export function to_blobs(_data: Bytes): Blob[] {
  const data = parse(BytesSchema, _data)
  const raw = hex_to_bytes(data)
  const stream = new Uint8Array(HEADER_BYTES + raw.length)
  const len = raw.length
  stream[0] = (len >>> 24) & 0xff
  stream[1] = (len >>> 16) & 0xff
  stream[2] = (len >>> 8) & 0xff
  stream[3] = len & 0xff
  stream.set(raw, HEADER_BYTES)

  const out: Blob[] = []
  let cursor = 0
  while (cursor < stream.length) {
    const blob = new Uint8Array(BYTES_PER_BLOB)
    for (
      let i = 0;
      i < FIELD_ELEMENTS_PER_BLOB && cursor < stream.length;
      i += 1
    ) {
      const slice = stream.subarray(
        cursor,
        cursor + DATA_BYTES_PER_FIELD_ELEMENT,
      )
      // First byte of the field element stays 0; the next 31 bytes
      // hold the data. Tail of the last field element is implicitly
      // zero-padded by Uint8Array allocation.
      blob.set(slice, i * BYTES_PER_FIELD_ELEMENT + 1)
      cursor += DATA_BYTES_PER_FIELD_ELEMENT
    }
    out.push(parse(BlobSchema, bytes_to_hex(blob)))
  }
  if (out.length === 0) {
    // Empty input still produces one blob carrying the 4-byte zero
    // header — round-trip-friendly.
    const blob = new Uint8Array(BYTES_PER_BLOB)
    blob.set(stream, 1)
    out.push(parse(BlobSchema, bytes_to_hex(blob)))
  }
  return out
}

export function from_blobs(_blobs: readonly Blob[]): Bytes {
  if (_blobs.length === 0) {
    throw new Error("from_blobs: empty blob list")
  }
  const stream_parts: Uint8Array[] = []
  for (const _blob of _blobs) {
    const blob = parse(BlobSchema, _blob)
    const bytes = hex_to_bytes(blob)
    const chunks = new Uint8Array(
      FIELD_ELEMENTS_PER_BLOB *
        DATA_BYTES_PER_FIELD_ELEMENT,
    )
    for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i += 1) {
      chunks.set(
        bytes.subarray(
          i * BYTES_PER_FIELD_ELEMENT + 1,
          (i + 1) * BYTES_PER_FIELD_ELEMENT,
        ),
        i * DATA_BYTES_PER_FIELD_ELEMENT,
      )
    }
    stream_parts.push(chunks)
  }
  const total_data =
    DATA_BYTES_PER_BLOB * stream_parts.length
  const stream = new Uint8Array(total_data)
  for (const [i, part] of stream_parts.entries()) {
    stream.set(part, i * DATA_BYTES_PER_BLOB)
  }
  const [b0 = 0, b1 = 0, b2 = 0, b3 = 0] = stream
  const len = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3
  if (len > stream.length - HEADER_BYTES) {
    throw new Error(
      `from_blobs: declared length ${len} exceeds available payload ${stream.length - HEADER_BYTES}`,
    )
  }
  return parse(
    BytesSchema,
    bytes_to_hex(
      stream.subarray(HEADER_BYTES, HEADER_BYTES + len),
    ),
  )
}
