import { Bytes4Schema, BytesSchema } from "@ethernauta/core"
import { hex_to_bytes } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { build_callback_calldata } from "./build-callback-calldata"

const SELECTOR = parse(Bytes4Schema, "0xf4d4d2f8")

describe("build-callback-calldata.ts", () => {
  it("prefixes the 4-byte callback selector", () => {
    const calldata = build_callback_calldata(
      SELECTOR,
      parse(BytesSchema, "0x"),
      parse(BytesSchema, "0x"),
    )
    expect(calldata.slice(0, 10)).toBe("0xf4d4d2f8")
  })

  it("encodes (bytes, bytes) head/tail per Solidity ABI", () => {
    // Two empty `bytes` values:
    //   offset_a = 0x40    (head_len = 64)
    //   offset_b = 0x60    (head_len + 32 for len(a)=0 body)
    //   len(a)   = 0
    //   len(b)   = 0
    const calldata = build_callback_calldata(
      SELECTOR,
      parse(BytesSchema, "0x"),
      parse(BytesSchema, "0x"),
    )
    const body = hex_to_bytes(calldata).slice(4)
    expect(body.length).toBe(32 * 4)
    expect(body[31]).toBe(0x40) // offset_a
    expect(body[63]).toBe(0x60) // offset_b
    expect(body[95]).toBe(0x00) // len(a)
    expect(body[127]).toBe(0x00) // len(b)
  })

  it("pads short bytes to 32-byte word boundary", () => {
    const response = parse(BytesSchema, "0xdeadbeef")
    const extra = parse(BytesSchema, "0xcafe")
    const calldata = build_callback_calldata(
      SELECTOR,
      response,
      extra,
    )
    const body = hex_to_bytes(calldata).slice(4)
    // head(64) + len(32) + word(32) for a + len(32) + word(32) for b
    expect(body.length).toBe(64 + 32 + 32 + 32 + 32)
    // len(a) = 4 (0xdeadbeef is 4 bytes)
    expect(body[95]).toBe(0x04)
    // first 4 bytes of a body
    expect(body[96]).toBe(0xde)
    expect(body[97]).toBe(0xad)
    expect(body[98]).toBe(0xbe)
    expect(body[99]).toBe(0xef)
    // remaining 28 padding bytes
    for (let i = 100; i < 128; i++) expect(body[i]).toBe(0)
    // len(b) = 2 (0xcafe is 2 bytes)
    expect(body[159]).toBe(0x02)
    expect(body[160]).toBe(0xca)
    expect(body[161]).toBe(0xfe)
  })

  it("places offset_b after the padded a-body for non-empty a", () => {
    // a is 33 bytes -> body padded to 64 bytes -> a-section = 32 + 64 = 96
    // offset_a = 64, offset_b = 64 + 96 = 160 (0xa0)
    const long_a = parse(
      BytesSchema,
      `0x${"aa".repeat(33)}`,
    )
    const calldata = build_callback_calldata(
      SELECTOR,
      long_a,
      parse(BytesSchema, "0x"),
    )
    const body = hex_to_bytes(calldata).slice(4)
    expect(body[31]).toBe(0x40)
    expect(body[63]).toBe(0xa0)
  })
})
