import { bytes48Schema, bytesSchema } from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { sha256 } from "@noble/hashes/sha2"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  fake_exponential,
  get_blob_gasprice,
} from "./blob-gas"
import { commitment_to_versioned_hash } from "./commitment-to-versioned-hash"
import {
  BLOB_GASPRICE_UPDATE_FRACTION,
  MIN_BLOB_GASPRICE,
} from "./constants"
import { from_blobs, to_blobs } from "./to-blobs"

describe("to_blobs / from_blobs", () => {
  it("round-trips empty input", () => {
    const data = parse(bytesSchema, "0x")
    const blobs = to_blobs(data)
    expect(blobs).toHaveLength(1)
    expect(from_blobs(blobs)).toBe(data)
  })

  it("round-trips short input", () => {
    const data = parse(bytesSchema, "0xdeadbeef")
    const blobs = to_blobs(data)
    expect(blobs).toHaveLength(1)
    expect(from_blobs(blobs)).toBe(data)
  })

  it("round-trips data that spans exactly one blob", () => {
    // 31 bytes per field element * 4096 elements = 126_976 bytes
    // minus the 4-byte length header = 126_972 bytes fit in one blob.
    const payload = new Uint8Array(126_972).fill(0xab)
    const data = parse(
      bytesSchema,
      `0x${"ab".repeat(payload.length)}`,
    )
    const blobs = to_blobs(data)
    expect(blobs).toHaveLength(1)
    expect(from_blobs(blobs)).toBe(data)
  })

  it("round-trips data that spills into a second blob", () => {
    const payload = new Uint8Array(200_000).fill(0x7f)
    const data = parse(
      bytesSchema,
      `0x${"7f".repeat(payload.length)}`,
    )
    const blobs = to_blobs(data)
    expect(blobs.length).toBeGreaterThan(1)
    expect(from_blobs(blobs)).toBe(data)
  })
})

describe("commitment_to_versioned_hash", () => {
  it("prefixes sha256(commitment) with 0x01", () => {
    const commitment = parse(
      bytes48Schema,
      `0x${"00".repeat(48)}`,
    )
    const expected = sha256(new Uint8Array(48))
    expected[0] = 0x01
    expect(commitment_to_versioned_hash(commitment)).toBe(
      bytes_to_hex(expected),
    )
  })
})

describe("blob-gas math", () => {
  it("fake_exponential(1, 0, k) is 1", () => {
    expect(
      fake_exponential(
        1n,
        0n,
        BLOB_GASPRICE_UPDATE_FRACTION,
      ),
    ).toBe(1n)
  })

  it("get_blob_gasprice grows with excess_blob_gas", () => {
    const a = get_blob_gasprice(0n)
    const b = get_blob_gasprice(
      BLOB_GASPRICE_UPDATE_FRACTION,
    )
    expect(a).toBe(MIN_BLOB_GASPRICE)
    expect(b).toBeGreaterThan(a)
  })
})
