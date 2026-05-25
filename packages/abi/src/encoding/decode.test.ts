import {
  addressSchema,
  bytesSchema,
  uint8Schema,
  uint256Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  address,
  bool,
  bytes,
  string_,
  uint8,
  uint256,
} from "../leaves"
import {
  decode_function_call,
  decode_function_result,
} from "./decode"
import { encode_function_call } from "./encode"

function strip_selector(
  calldata: Uint8Array,
): `0x${string}` {
  return bytes_to_hex(calldata.slice(4))
}

describe("decode.ts", () => {
  describe("decode_function_result", () => {
    it("should round-trip a single uint256", () => {
      const expected =
        "0x0000000000000000000000000000000000000000000000000000000000000005" as `0x${string}`
      const [result] = decode_function_result(
        [uint256()] as const,
        expected,
      )
      expect(result).toBe(expected)
    })

    it("should round-trip a single address", () => {
      const hex =
        "0x000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94" as `0x${string}`
      const [result] = decode_function_result(
        [address()] as const,
        hex,
      )
      expect(result).toBe(
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      )
    })

    it("should round-trip a bool", () => {
      const true_hex =
        "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`
      const false_hex =
        "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`
      const [t] = decode_function_result(
        [bool()] as const,
        true_hex,
      )
      const [f] = decode_function_result(
        [bool()] as const,
        false_hex,
      )
      expect(t).toBe(true)
      expect(f).toBe(false)
    })

    it("should round-trip a dynamic string", () => {
      const calldata = encode_function_call({
        name: "echo",
        args: [string_()] as const,
        values: ["hello world"],
      })
      const hex = strip_selector(calldata)
      const [result] = decode_function_result(
        [string_()] as const,
        hex,
      )
      expect(result).toBe("hello world")
    })

    it("should round-trip mixed static + dynamic", () => {
      const calldata = encode_function_call({
        name: "mixed",
        args: [address(), string_(), uint8()] as const,
        values: [
          parse(
            addressSchema,
            "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          ),
          "hi",
          parse(uint8Schema, "0x2a"),
        ],
      })
      const hex = strip_selector(calldata)
      const [a, s, u] = decode_function_result(
        [address(), string_(), uint8()] as const,
        hex,
      )
      expect(a).toBe(
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      )
      expect(s).toBe("hi")
      expect(BigInt(u)).toBe(42n)
    })
  })

  describe("decode_function_call", () => {
    it("should round-trip transfer(address,uint256)", () => {
      const to = parse(
        addressSchema,
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      )
      const value = parse(
        uint256Schema,
        "0xde0b6b3a7640000",
      )
      const calldata = encode_function_call({
        name: "transfer",
        args: [address(), uint256()] as const,
        values: [to, value],
      })
      const { selector, args } = decode_function_call(
        [address(), uint256()] as const,
        bytes_to_hex(calldata),
      )
      expect(selector).toBe("0xa9059cbb")
      expect(args[0]).toBe(to)
      expect(BigInt(args[1] as string)).toBe(BigInt(value))
    })

    it("should round-trip a signature with bytes", () => {
      const from = parse(
        addressSchema,
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      )
      const to = parse(
        addressSchema,
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      )
      const token_id = parse(uint256Schema, "0x7")
      const data = parse(bytesSchema, "0xdeadbeef")
      const calldata = encode_function_call({
        name: "safeTransferFrom",
        args: [
          address(),
          address(),
          uint256(),
          bytes(),
        ] as const,
        values: [from, to, token_id, data],
      })
      const { selector, args } = decode_function_call(
        [address(), address(), uint256(), bytes()] as const,
        bytes_to_hex(calldata),
      )
      expect(selector).toBe("0xb88d4fde")
      expect(args[0]).toBe(from)
      expect(args[1]).toBe(to)
      expect(BigInt(args[2] as string)).toBe(7n)
      expect(args[3]).toBe(data)
    })

    it("should throw on calldata shorter than 4 bytes", () => {
      expect(() =>
        decode_function_call(
          [] as const,
          "0xab" as `0x${string}`,
        ),
      ).toThrow(/calldata too short/)
    })
  })
})
