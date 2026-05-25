import { describe, expect, it } from "vitest"

import { encode_rlp } from "./rlp"

describe("rlp.ts — encode", () => {
  it("encodes short strings correctly", () => {
    const result = encode_rlp("hello")
    expect(result[0]).toBe(0x85)
    expect(result.length).toBe(6)
    expect(result[1]).toBe(104)
  })

  it("encodes the empty string correctly", () => {
    const result = encode_rlp("")
    expect(result).toEqual(new Uint8Array([0x80]))
  })

  it("encodes hex strings correctly", () => {
    const result = encode_rlp("0x1234")
    expect(result[0]).toBe(0x82)
    expect(result[1]).toBe(0x12)
    expect(result[2]).toBe(0x34)
    expect(result.length).toBe(3)
  })

  it("encodes single bytes < 0x80 as themselves", () => {
    const result = encode_rlp(0x42)
    expect(result).toEqual(new Uint8Array([0x42]))
  })

  it("encodes single bytes >= 0x80 with a string prefix", () => {
    const result = encode_rlp(0x80)
    expect(result).toEqual(new Uint8Array([0x81, 0x80]))
  })

  it("encodes zero as the empty string", () => {
    const result = encode_rlp(0n)
    expect(result).toEqual(new Uint8Array([0x80]))
  })

  it("encodes multi-byte numbers correctly", () => {
    const result = encode_rlp(256)
    expect(result).toEqual(
      new Uint8Array([0x82, 0x01, 0x00]),
    )
  })

  it("encodes empty arrays correctly", () => {
    const result = encode_rlp([])
    expect(result).toEqual(new Uint8Array([0xc0]))
  })

  it("encodes simple arrays correctly", () => {
    const result = encode_rlp(["hello", 42])
    expect(result[0]).toBe(0xc7)
    expect(result.length).toBe(8)
  })

  it("encodes nested arrays correctly", () => {
    const result = encode_rlp([["nested"]])
    expect(result[0]).toBe(0xc8)
    expect(result[1]).toBe(0xc7)
    expect(result[2]).toBe(0x86)
  })

  it("encodes 56-byte strings with the long format", () => {
    const long_string = "a".repeat(56)
    const result = encode_rlp(long_string)
    expect(result[0]).toBe(0xb8)
    expect(result[1]).toBe(56)
    expect(result.length).toBe(58)
  })

  it("encodes length with big-endian byte ordering", () => {
    const very_long_string = "x".repeat(1234)
    const result = encode_rlp(very_long_string)
    expect(result[0]).toBe(0xb9)
    expect(result[1]).toBe(4)
    expect(result[2]).toBe(210)
    expect(result.length).toBe(1237)
  })

  it("encodes exactly 55-byte strings with the short format", () => {
    const exactly_55 = "a".repeat(55)
    const result = encode_rlp(exactly_55)
    expect(result[0]).toBe(0xb7)
    expect(result.length).toBe(56)
  })

  it("encodes Uint8Array data correctly", () => {
    const data = new Uint8Array([0x12, 0x34, 0x56])
    const result = encode_rlp(data)
    expect(result[0]).toBe(0x83)
    expect(result[1]).toBe(0x12)
    expect(result[2]).toBe(0x34)
    expect(result[3]).toBe(0x56)
  })

  it("encodes mixed data structures correctly", () => {
    const input = ["hello", 42, ["nested", 0x80]]
    const result = encode_rlp(input)
    expect(result[0]).toBe(0xd1)
    expect(result.length).toBe(18)
    expect(Array.from(result)).toContain(104)
    expect(Array.from(result)).toContain(42)
    expect(Array.from(result)).toContain(0x80)
  })
})
