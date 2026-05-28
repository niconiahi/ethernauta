import { Uint64Schema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { fixed_array } from "./fixed-array"
import { uint64 } from "./leaves"

describe("fixed_array", () => {
  it("round-trips a static T[K] without a length prefix", () => {
    const codec = fixed_array(uint64(), 3)
    expect(codec.signature).toBe("uint64[3]")
    expect(codec.is_dynamic).toBe(false)
    const values = [
      parse(Uint64Schema, "0x1"),
      parse(Uint64Schema, "0x2"),
      parse(Uint64Schema, "0xff"),
    ]
    const bytes = codec.encode(values)
    expect(bytes.length).toBe(3 * 32)
    const decoded = codec.decode(bytes, 0)
    expect(decoded).toEqual([
      `0x${"00".repeat(31)}01`,
      `0x${"00".repeat(31)}02`,
      `0x${"00".repeat(31)}ff`,
    ])
  })

  it("rejects wrong-length input on encode", () => {
    const codec = fixed_array(uint64(), 3)
    const v = (h: string) => parse(Uint64Schema, h)
    expect(() =>
      codec.encode([v("0x1"), v("0x2")]),
    ).toThrow()
    expect(() =>
      codec.encode([
        v("0x1"),
        v("0x2"),
        v("0x3"),
        v("0x4"),
      ]),
    ).toThrow()
  })
})
