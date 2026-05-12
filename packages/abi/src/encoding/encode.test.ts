import { describe, expect, it } from "vitest"
import {
  encode_address,
  encode_call,
  encode_string,
  encode_uint256,
  to_selector,
} from "./encode"

function from_hex(hex: string): Uint8Array {
  const matches = hex.match(/.{2}/g)
  if (!matches) return new Uint8Array([])
  return new Uint8Array(
    matches.map((b) => Number.parseInt(b, 16)),
  )
}

describe("encode.ts", () => {
  describe("to_selector", () => {
    it("should return first 4 bytes of keccak256 of the signature", () => {
      const result = to_selector(
        "safeMint(address,string)",
      )
      expect(result).toEqual(
        new Uint8Array([210, 4, 196, 94]),
      )
    })
  })

  describe("encode_address", () => {
    it("should left-pad address to 32 bytes", () => {
      const result = encode_address(
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      )
      expect(result).toHaveLength(32)
      expect(result).toEqual(
        from_hex(
          "000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94",
        ),
      )
    })
  })

  describe("encode_uint256", () => {
    it("should encode 0 as 32 zero bytes", () => {
      const result = encode_uint256(0n)
      expect(result).toHaveLength(32)
      expect(result).toEqual(new Uint8Array(32))
    })

    it("should encode 64 as 0x40 right-aligned in 32 bytes", () => {
      const result = encode_uint256(64n)
      expect(result).toHaveLength(32)
      expect(result).toEqual(
        from_hex(
          "0000000000000000000000000000000000000000000000000000000000000040",
        ),
      )
    })
  })

  describe("encode_string", () => {
    it("should encode 'hello' as 32-byte length + 32-byte right-padded data", () => {
      const result = encode_string("hello")
      expect(result).toHaveLength(64)
      expect(result).toEqual(
        from_hex(
          // length: 5
          "0000000000000000000000000000000000000000000000000000000000000005" +
            // "hello" right-padded to 32 bytes
            "68656c6c6f000000000000000000000000000000000000000000000000000000",
        ),
      )
    })

    it("should encode empty string as 32 zero bytes length + no data", () => {
      const result = encode_string("")
      expect(result).toHaveLength(32)
      expect(result).toEqual(new Uint8Array(32))
    })

    it("should right-pad data that spans multiple 32-byte chunks", () => {
      // 33 chars → spans 2 chunks, total tail = 32 (length) + 64 (data) = 96 bytes
      const result = encode_string("a".repeat(33))
      expect(result).toHaveLength(96)
    })
  })

  describe("encode_call", () => {
    it("should produce selector + address + offset + string tail", () => {
      const result = encode_call(
        "safeMint(address,string)",
        [
          "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          "hello",
        ],
      )
      // 4 (selector) + 32 (address) + 32 (offset) + 64 (string) = 132
      expect(result).toHaveLength(132)
      expect(result).toEqual(
        from_hex(
          // selector: keccak256("safeMint(address,string)")[0:4]
          "d204c45e" +
            // address left-padded
            "000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94" +
            // offset to string = 64 (0x40)
            "0000000000000000000000000000000000000000000000000000000000000040" +
            // string length = 5
            "0000000000000000000000000000000000000000000000000000000000000005" +
            // "hello" right-padded
            "68656c6c6f000000000000000000000000000000000000000000000000000000",
        ),
      )
    })
  })
})
