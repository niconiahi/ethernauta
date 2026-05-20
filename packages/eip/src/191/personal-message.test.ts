import { keccak_256 } from "@noble/hashes/sha3"
import { describe, expect, it } from "vitest"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  build_personal_message,
  build_personal_message_hex,
} from "./personal-message"

describe("personal-message.ts", () => {
  it("should prefix a utf8 message with the eip-191 header", () => {
    const out = build_personal_message("hello")
    const expected = new TextEncoder().encode(
      "\x19Ethereum Signed Message:\n5hello",
    )
    expect(out).toEqual(expected)
  })

  it("should use the byte length of the utf8 encoding for emoji", () => {
    const out = build_personal_message("a😀")
    const decoded = new TextDecoder().decode(out)
    expect(decoded.startsWith("\x19Ethereum Signed Message:\n5")).toBe(true)
  })

  it("should decode a 0x-prefixed hex string as raw bytes", () => {
    const out = build_personal_message("0xdeadbeef")
    const expected = new TextEncoder()
      .encode("\x19Ethereum Signed Message:\n4")
    const merged = new Uint8Array(expected.length + 4)
    merged.set(expected, 0)
    merged.set(
      new Uint8Array([0xde, 0xad, 0xbe, 0xef]),
      expected.length,
    )
    expect(out).toEqual(merged)
  })

  it("should accept Uint8Array input directly", () => {
    const bytes = new Uint8Array([1, 2, 3])
    const out = build_personal_message(bytes)
    expect(out.length).toBe(
      "\x19Ethereum Signed Message:\n3".length + 3,
    )
    expect(out.slice(-3)).toEqual(bytes)
  })

  it("should match a known keccak256 vector", () => {
    // hash of personal_sign("Hello, world!") — a stable vector
    const digest = keccak_256(
      build_personal_message("Hello, world!"),
    )
    expect(bytes_to_hex(digest)).toBe(
      "0xb453bd4e271eed985cbab8231da609c4ce0a9cf1f763b6c1594e76315510e0f1",
    )
  })

  it("should return 0x-prefixed hex for the convenience helper", () => {
    const hex = build_personal_message_hex("hi")
    expect(hex.startsWith("0x")).toBe(true)
    expect(hex.length % 2).toBe(0)
  })
})
