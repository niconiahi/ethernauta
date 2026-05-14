import { describe, expect, it } from "vitest"
import { safeParse } from "valibot"
import { uint256Schema } from "./uint-256"

describe("uint256Schema", () => {
  it("accepts 32-byte padded hex returned by decode_function_result", () => {
    const padded =
      "0x0000000000000000000000000000000000000000000000000000000000000002"
    expect(safeParse(uint256Schema, padded).success).toBe(true)
  })

  it("accepts the all-zero padded value (uint256 zero)", () => {
    const zero =
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    expect(safeParse(uint256Schema, zero).success).toBe(true)
  })

  it("accepts canonical short hex (no leading zeros)", () => {
    expect(safeParse(uint256Schema, "0x2").success).toBe(true)
    expect(safeParse(uint256Schema, "0x0").success).toBe(true)
    expect(
      safeParse(uint256Schema, "0x1bc16d674ec80000").success,
    ).toBe(true)
  })

  it("accepts max uint256 (64 f's)", () => {
    const max = `0x${"f".repeat(64)}` as const
    expect(safeParse(uint256Schema, max).success).toBe(true)
  })

  it("rejects values without 0x prefix", () => {
    expect(safeParse(uint256Schema, "2").success).toBe(false)
  })

  it("rejects empty 0x", () => {
    expect(safeParse(uint256Schema, "0x").success).toBe(false)
  })

  it("rejects non-hex characters", () => {
    expect(safeParse(uint256Schema, "0xzz").success).toBe(false)
  })

  it("rejects more than 64 hex chars (overflow)", () => {
    const overflow = `0x1${"0".repeat(64)}`
    expect(safeParse(uint256Schema, overflow).success).toBe(false)
  })

  it("rejects non-string inputs", () => {
    expect(safeParse(uint256Schema, 2).success).toBe(false)
    expect(safeParse(uint256Schema, 2n).success).toBe(false)
    expect(safeParse(uint256Schema, null).success).toBe(false)
  })
})
