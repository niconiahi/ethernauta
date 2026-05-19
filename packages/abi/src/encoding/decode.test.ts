import { bytes_to_hex } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"
import {
  decode_function_call,
  decode_function_result,
} from "./decode"
import {
  encode_function_call,
  encode_string,
  encode_uint256,
} from "./encode"

function strip_selector(
  calldata: Uint8Array,
): `0x${string}` {
  return bytes_to_hex(calldata.slice(4))
}

describe("decode.ts", () => {
  describe("decode_function_result", () => {
    it("should round-trip a single uint256", () => {
      const expected = ("0x" +
        "0000000000000000000000000000000000000000000000000000000000000005") as `0x${string}`
      const [result] = decode_function_result(
        ["uint256"],
        expected,
      )
      expect(result).toBe(expected)
    })

    it("should round-trip a single address", () => {
      const hex = ("0x" +
        bytes_to_hex(
          encode_uint256(
            BigInt(
              "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
            ),
          ),
        ).slice(2)) as `0x${string}`
      const [result] = decode_function_result(
        ["address"],
        hex,
      )
      expect(result).toBe(
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      )
    })

    it("should round-trip a bool", () => {
      const [t] = decode_function_result(
        ["bool"],
        `0x${bytes_to_hex(encode_uint256(1n)).slice(2)}` as `0x${string}`,
      )
      const [f] = decode_function_result(
        ["bool"],
        `0x${bytes_to_hex(encode_uint256(0n)).slice(2)}` as `0x${string}`,
      )
      expect(t).toBe(true)
      expect(f).toBe(false)
    })

    it("should round-trip a dynamic string", () => {
      // wrap encoded string with the head offset (0x20) like
      // a real eth_call return for a single string output
      const inner = encode_string("hello world")
      const head = encode_uint256(32n)
      const buf = new Uint8Array(head.length + inner.length)
      buf.set(head, 0)
      buf.set(inner, head.length)
      const hex = bytes_to_hex(buf)
      const [result] = decode_function_result(
        ["string"],
        hex,
      )
      expect(result).toBe("hello world")
    })

    it("should decode encode_function_call output (without selector)", () => {
      // encode mint(string) with "data"; strip selector to
      // get just the encoded args, mimicking eth_call result
      const calldata = encode_function_call(
        "mint(string)",
        ["string"],
        ["data"],
      )
      const hex = strip_selector(calldata)
      const [result] = decode_function_result(
        ["string"],
        hex,
      )
      expect(result).toBe("data")
    })
  })

  describe("decode_function_call", () => {
    it("should round-trip transfer(address,uint256)", () => {
      const to =
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94"
      const value = 1000000000000000000n
      const calldata = encode_function_call(
        "transfer(address,uint256)",
        ["address", "uint256"],
        [to, value],
      )
      const { selector, args } = decode_function_call(
        ["address", "uint256"],
        bytes_to_hex(calldata),
      )
      expect(selector).toBe("0xa9059cbb")
      expect(args[0]).toBe(to)
      // uint256 values come back as 32-byte hex
      expect(BigInt(args[1] as string)).toBe(value)
    })

    it("should round-trip approve(address,uint256)", () => {
      const spender =
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      const value = 42n
      const calldata = encode_function_call(
        "approve(address,uint256)",
        ["address", "uint256"],
        [spender, value],
      )
      const { selector, args } = decode_function_call(
        ["address", "uint256"],
        bytes_to_hex(calldata),
      )
      expect(selector).toBe("0x095ea7b3")
      expect(args[0]).toBe(spender)
      expect(BigInt(args[1] as string)).toBe(value)
    })

    it("should round-trip a signature with bytes", () => {
      const from =
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94"
      const to =
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      const token_id = 7n
      const data = "0xdeadbeef" as `0x${string}`
      const calldata = encode_function_call(
        "safeTransferFrom(address,address,uint256,bytes)",
        ["address", "address", "uint256", "bytes"],
        [from, to, token_id, data],
      )
      const { selector, args } = decode_function_call(
        ["address", "address", "uint256", "bytes"],
        bytes_to_hex(calldata),
      )
      expect(selector).toBe("0xb88d4fde")
      expect(args[0]).toBe(from)
      expect(args[1]).toBe(to)
      expect(BigInt(args[2] as string)).toBe(token_id)
      expect(args[3]).toBe(data)
    })

    it("should throw on calldata shorter than 4 bytes", () => {
      expect(() =>
        decode_function_call([], "0xab" as `0x${string}`),
      ).toThrow(/calldata too short/)
    })
  })
})
