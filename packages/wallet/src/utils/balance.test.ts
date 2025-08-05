import { describe, it, expect } from "vitest"
import { wei_to_eth } from "./balance"

describe("balance.ts", () => {
  it('returns "0" for 0 wei', () => {
    expect(wei_to_eth(0n)).toBe("0")
  })

  it('converts exactly 1 ETH (10¹⁸ wei) to "1"', () => {
    const oneEth = 1n * 10n ** 18n
    expect(wei_to_eth(oneEth)).toBe("1")
  })

  it("converts 0.5 ETH correctly", () => {
    const halfEth = 5n * 10n ** 17n
    expect(wei_to_eth(halfEth)).toBe("0.5")
  })

  it("shows full precision without truncation", () => {
    const val = 1234567890123456789n
    expect(wei_to_eth(val)).toBe("1.234567890123456789")
  })

  it("pads small fractional parts with leading zeros", () => {
    const tiny = 1234567000000n
    expect(wei_to_eth(tiny)).toBe("0.000001234567")
  })

  it("shows very small values with full precision", () => {
    const almostOne = 1000000000000000001n
    expect(wei_to_eth(almostOne)).toBe(
      "1.000000000000000001",
    )
  })

  it("removes trailing zeros correctly", () => {
    const withTrailingZeros = 1000000000000000n // 0.001 ETH with trailing zeros
    expect(wei_to_eth(withTrailingZeros)).toBe("0.001")
  })

  it("handles very small amounts correctly", () => {
    const oneWei = 1n
    expect(wei_to_eth(oneWei)).toBe("0.000000000000000001")
  })
})
