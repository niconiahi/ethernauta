import { BytesSchema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  ANNOUNCEMENT_EVENT_TOPIC,
  decode_metadata,
  encode_metadata,
  view_tag_matches,
} from "./announcement"

// keccak256("Announcement(uint256,address,address,bytes,bytes)")
const EXPECTED_TOPIC =
  "0x5f0eab8057630ba7676c49b4f21a0231414e79474595be8e4c432fbf6bf0f4e7"

describe("announcement.ts — ANNOUNCEMENT_EVENT_TOPIC", () => {
  it("should match keccak256 of the canonical event signature", () => {
    expect(ANNOUNCEMENT_EVENT_TOPIC).toBe(EXPECTED_TOPIC)
  })

  it("should be a 32-byte hex hash", () => {
    expect(ANNOUNCEMENT_EVENT_TOPIC).toMatch(
      /^0x[0-9a-f]{64}$/,
    )
  })
})

describe("announcement.ts — metadata round-trip", () => {
  it("should encode view tag as the first byte and preserve the body", () => {
    const encoded = encode_metadata({
      view_tag: 0x42,
      body: parse(BytesSchema, "0xdeadbeef"),
    })
    expect(encoded.startsWith("0x42")).toBe(true)
    expect(encoded.endsWith("deadbeef")).toBe(true)
  })

  it("should decode back to the same view tag and body", () => {
    const decoded = decode_metadata(
      parse(BytesSchema, "0x42deadbeef"),
    )
    expect(decoded.view_tag).toBe(0x42)
    expect(decoded.body).toBe("0xdeadbeef")
  })

  it("should treat empty metadata as zero view tag", () => {
    const decoded = decode_metadata(
      parse(BytesSchema, "0x"),
    )
    expect(decoded.view_tag).toBe(0)
    expect(decoded.body).toBe("0x")
  })
})

describe("announcement.ts — view_tag_matches", () => {
  it("should match equal bytes", () => {
    expect(view_tag_matches(0xab, 0xab)).toBe(true)
  })

  it("should mask to a single byte", () => {
    expect(view_tag_matches(0x1ab, 0xab)).toBe(true)
  })

  it("should reject different bytes", () => {
    expect(view_tag_matches(0xab, 0xac)).toBe(false)
  })
})
