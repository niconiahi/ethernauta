import { describe, expect, it } from "vitest"
import { personal_sign_message } from "./personal-sign"

const PRIVATE_KEY = new Uint8Array([
  0x4c, 0x0b, 0x84, 0x52, 0xc7, 0x4b, 0x18, 0x9d, 0x59,
  0x33, 0xa9, 0x2c, 0xe2, 0x99, 0xc3, 0xfa, 0x83, 0xd7,
  0xc8, 0x6a, 0x2a, 0x69, 0x71, 0x2f, 0xc5, 0xb7, 0x5e,
  0xed, 0xa0, 0xa6, 0x9e, 0x77,
])

describe("personal-sign.ts", () => {
  it("should return a 65-byte 0x-prefixed signature", () => {
    const sig = personal_sign_message("hello", PRIVATE_KEY)
    expect(sig.startsWith("0x")).toBe(true)
    expect(sig.length).toBe(2 + 65 * 2)
  })

  it("should be deterministic for the same input (RFC 6979)", () => {
    const a = personal_sign_message("hello", PRIVATE_KEY)
    const b = personal_sign_message("hello", PRIVATE_KEY)
    expect(a).toBe(b)
  })

  it("should produce different signatures for different messages", () => {
    const a = personal_sign_message("hello", PRIVATE_KEY)
    const b = personal_sign_message("world", PRIVATE_KEY)
    expect(a).not.toBe(b)
  })

  it("should end with a v byte of 0x1b or 0x1c", () => {
    const sig = personal_sign_message("hello", PRIVATE_KEY)
    const v = sig.slice(-2)
    expect(["1b", "1c"]).toContain(v.toLowerCase())
  })
})
