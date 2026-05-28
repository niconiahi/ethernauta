import {
  AddressSchema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  address,
  string_,
  uint64,
  uint256,
} from "../leaves"
import {
  build_signature,
  encode_constructor_call,
  encode_function_call,
  function_selector,
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
      const result = to_selector("safeMint(address,string)")
      expect(result).toEqual(
        new Uint8Array([210, 4, 196, 94]),
      )
    })
  })

  describe("build_signature", () => {
    it("should join codec signatures with commas", () => {
      const sig = build_signature("transfer", [
        address(),
        uint256(),
      ])
      expect(sig).toBe("transfer(address,uint256)")
    })
  })

  describe("function_selector", () => {
    it("should hash the canonical signature to 4-byte hex", () => {
      const sel = function_selector("transfer", [
        address(),
        uint256(),
      ])
      expect(sel).toBe("0xa9059cbb")
    })
  })

  describe("encode_function_call", () => {
    it("should produce selector + address + offset + string tail", () => {
      const result = encode_function_call({
        name: "safeMint",
        args: [address(), string_()] as const,
        values: [
          parse(
            AddressSchema,
            "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          ),
          "hello",
        ],
      })
      // 4 (selector) + 32 (address) + 32 (offset) + 64 (string) = 132
      expect(result).toHaveLength(132)
      expect(bytes_to_hex(result)).toBe(
        // selector: keccak256("safeMint(address,string)")[0:4]
        "0xd204c45e" +
          // address left-padded
          "000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94" +
          // offset to string = 64 (0x40)
          "0000000000000000000000000000000000000000000000000000000000000040" +
          // string length = 5
          "0000000000000000000000000000000000000000000000000000000000000005" +
          // "hello" right-padded
          "68656c6c6f000000000000000000000000000000000000000000000000000000",
      )
    })

    it("should encode an empty-args function as just the selector", () => {
      const result = encode_function_call({
        name: "totalSupply",
        args: [] as const,
        values: [],
      })
      expect(result).toHaveLength(4)
      expect(bytes_to_hex(result)).toBe("0x18160ddd")
    })

    it("should encode an argless constructor as just the bytecode", () => {
      const bytecode = from_hex("6080604052")
      const result = encode_constructor_call({
        bytecode,
        args: [] as const,
        values: [],
      })
      expect(result).toHaveLength(bytecode.length)
      expect(bytes_to_hex(result)).toBe("0x6080604052")
    })

    it("should append ABI-encoded args to bytecode", () => {
      const bytecode = from_hex("6080604052")
      const result = encode_constructor_call({
        bytecode,
        args: [address(), uint64()] as const,
        values: [
          parse(
            AddressSchema,
            "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          ),
          parse(Uint64Schema, "0xde0b6b3a7640000"),
        ],
      })
      expect(result).toHaveLength(bytecode.length + 64)
      expect(bytes_to_hex(result)).toBe(
        "0x6080604052" +
          "000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94" +
          "0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      )
    })

    it("should encode transfer(address,uint256)", () => {
      const result = encode_function_call({
        name: "transfer",
        args: [address(), uint256()] as const,
        values: [
          parse(
            AddressSchema,
            "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          ),
          parse(Uint256Schema, "0xde0b6b3a7640000"), // 1e18 as hex
        ],
      })
      expect(bytes_to_hex(result).slice(0, 10)).toBe(
        "0xa9059cbb",
      )
      // 4 + 32 + 32 = 68 bytes
      expect(result).toHaveLength(68)
      expect(bytes_to_hex(result)).toBe(
        "0xa9059cbb" +
          "000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94" +
          "0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      )
    })
  })
})
