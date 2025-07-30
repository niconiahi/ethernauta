import { describe, it, expect } from "vitest"
import { encode } from "./rlp"

describe("rlp.ts", () => {
  it("should encode short strings correctly", () => {
    const result = encode("hello")
    // "hello" → [0x85, 104, 101, 108, 108, 111] (0x80 + 5 bytes)
    expect(result[0]).toBe(0x85) // Short string prefix
    expect(result.length).toBe(6) // 1 prefix + 5 content
    expect(result[1]).toBe(104) // 'h'
  })

  it("should encode empty string correctly", () => {
    const result = encode("")
    expect(result).toEqual(new Uint8Array([0x80])) // Empty string
  })

  it("should encode hex strings correctly", () => {
    const result = encode("0x1234")
    // Hex string "0x1234" → [0x82, 0x12, 0x34] (0x80 + 2 bytes)
    expect(result[0]).toBe(0x82) // Short string prefix
    expect(result[1]).toBe(0x12) // First hex byte
    expect(result[2]).toBe(0x34) // Second hex byte
    expect(result.length).toBe(3)
  })

  it("should encode single bytes < 0x80 as themselves", () => {
    const result = encode(0x42)
    expect(result).toEqual(new Uint8Array([0x42])) // No prefix needed
  })

  it("should encode single bytes >= 0x80 with string prefix", () => {
    const result = encode(0x80)
    expect(result).toEqual(new Uint8Array([0x81, 0x80])) // Short string prefix
  })

  it("should encode zero as empty string", () => {
    const result = encode(0n)
    expect(result).toEqual(new Uint8Array([0x80])) // Empty string encoding
  })

  it("should encode multi-byte numbers correctly", () => {
    const result = encode(256) // 0x0100
    expect(result).toEqual(
      new Uint8Array([0x82, 0x01, 0x00]),
    ) // 0x80 + 2 bytes
  })

  it("should encode empty arrays correctly", () => {
    const result = encode([])
    expect(result).toEqual(new Uint8Array([0xc0])) // Empty list
  })

  it("should encode simple arrays correctly", () => {
    const result = encode(["hello", 42])
    // Expected: short list containing "hello" (6 bytes) + 42 (1 byte) = 7 bytes total
    expect(result[0]).toBe(0xc7) // Short list prefix (0xc0 + 7)
    expect(result.length).toBe(8) // 1 prefix + 7 content
  })

  it("should encode nested arrays correctly", () => {
    const result = encode([["nested"]])
    // Nested structure should have proper list prefixes
    expect(result[0]).toBe(0xc8) // Outer list prefix
    expect(result[1]).toBe(0xc7) // Inner list prefix (0xc0 + 7 bytes)
    expect(result[2]).toBe(0x86) // "nested" string prefix
  })

  // Long encoding tests
  it("should encode 56-byte strings with long format", () => {
    const long_string = "a".repeat(56) // Crosses 55-byte boundary
    const result = encode(long_string)

    expect(result[0]).toBe(0xb8) // Long string prefix (0xb7 + 1)
    expect(result[1]).toBe(56) // Length byte
    expect(result.length).toBe(58) // 2 prefix + 56 content
  })

  it("should encode length with big-endian byte ordering", () => {
    // Test the bitwise magic: 1234 should become [4, 210]
    // 1234 in binary: 10011010010
    // First extraction: 1234 & 0xFF = 210, then 1234 >> 8 = 4
    // Second extraction: 4 & 0xFF = 4, then 4 >> 8 = 0
    // unshift() puts 4 before 210: [4, 210]
    // Verification: 4 × 256 + 210 = 1234 ✓

    const very_long_string = "x".repeat(1234)
    const result = encode(very_long_string)

    expect(result[0]).toBe(0xb9) // 0xb7 + 2 (length takes 2 bytes)
    expect(result[1]).toBe(4) // Most significant byte first (big-endian!)
    expect(result[2]).toBe(210) // Least significant byte second
    expect(result.length).toBe(1237) // 3 prefix + 1234 content
  })

  it("should encode exactly 55-byte strings with short format", () => {
    const exactly_55 = "a".repeat(55)
    const result = encode(exactly_55)

    expect(result[0]).toBe(0xb7) // Short string max: 0x80 + 55
    expect(result.length).toBe(56) // 1 prefix + 55 content
  })

  it("should encode Uint8Array data correctly", () => {
    const data = new Uint8Array([0x12, 0x34, 0x56])
    const result = encode(data)

    expect(result[0]).toBe(0x83) // Short string: 0x80 + 3
    expect(result[1]).toBe(0x12)
    expect(result[2]).toBe(0x34)
    expect(result[3]).toBe(0x56)
  })

  it("should encode mixed data structure correctly", () => {
    // Test realistic mixed data: ["hello", 42, ["nested", 0x80]]
    const input = ["hello", 42, ["nested", 0x80]]
    const result = encode(input)

    expect(result[0]).toBe(0xd1) // List prefix for 17 bytes total (0xc0 + 17)
    expect(result.length).toBe(18) // 1 prefix + 17 content bytes

    // Verify it contains our expected components
    expect(Array.from(result)).toContain(104) // 'h' from "hello"
    expect(Array.from(result)).toContain(42) // literal 42
    expect(Array.from(result)).toContain(0x80) // hex value
  })
})
