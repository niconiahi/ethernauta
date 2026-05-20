import { describe, expect, it } from "vitest"
import { format_unit, parse_unit } from "./unit"

describe("format_unit", () => {
  it('returns "0" for 0n', () => {
    expect(format_unit(0n)).toBe("0")
  })

  it("formats 1 ether (default 18 decimals)", () => {
    expect(format_unit(10n ** 18n)).toBe("1")
  })

  it("formats 1.5 ether", () => {
    expect(format_unit(15n * 10n ** 17n)).toBe("1.5")
  })

  it("formats 1 wei at full precision", () => {
    expect(format_unit(1n)).toBe("0.000000000000000001")
  })

  it("strips trailing zeros from the fraction", () => {
    expect(format_unit(1234567000000n)).toBe(
      "0.000001234567",
    )
  })

  it("formats USDC amounts with decimals=6", () => {
    expect(format_unit(1500000n, 6)).toBe("1.5")
  })

  it('returns "0" for 0n with custom decimals', () => {
    expect(format_unit(0n, 6)).toBe("0")
  })

  it("formats negative values", () => {
    expect(format_unit(-15n * 10n ** 17n)).toBe("-1.5")
  })

  it("formats whole-unit values without trailing dot", () => {
    expect(format_unit(5n * 10n ** 18n)).toBe("5")
  })
})

describe("parse_unit", () => {
  it('parses "0" to 0n', () => {
    expect(parse_unit("0")).toBe(0n)
  })

  it("parses 1 ether (default 18 decimals)", () => {
    expect(parse_unit("1")).toBe(10n ** 18n)
  })

  it("parses 1.5 ether", () => {
    expect(parse_unit("1.5")).toBe(15n * 10n ** 17n)
  })

  it("parses smallest wei (full 18 fractional digits)", () => {
    expect(parse_unit("0.000000000000000001")).toBe(1n)
  })

  it("parses USDC amounts with decimals=6", () => {
    expect(parse_unit("1.5", 6)).toBe(1500000n)
  })

  it('parses leading-dot inputs like ".5"', () => {
    expect(parse_unit(".5")).toBe(5n * 10n ** 17n)
  })

  it('parses trailing-dot inputs like "1."', () => {
    expect(parse_unit("1.")).toBe(10n ** 18n)
  })

  it("parses negative values", () => {
    expect(parse_unit("-1.5")).toBe(-15n * 10n ** 17n)
  })

  it("throws on empty input", () => {
    expect(() => parse_unit("")).toThrow()
  })

  it("throws on garbage input", () => {
    expect(() => parse_unit("abc")).toThrow()
  })

  it("throws on multiple dots", () => {
    expect(() => parse_unit("1.2.3")).toThrow()
  })

  it("throws when fraction exceeds decimals", () => {
    expect(() => parse_unit("1.234567", 2)).toThrow()
  })
})

describe("round-trip", () => {
  it("format_unit ∘ parse_unit is identity for typical values", () => {
    const cases = ["0", "1", "1.5", "0.000000000000000001"]
    for (const c of cases) {
      expect(format_unit(parse_unit(c))).toBe(c)
    }
  })

  it("parse_unit ∘ format_unit is identity for typical bigints", () => {
    const cases = [0n, 1n, 10n ** 18n, 15n * 10n ** 17n]
    for (const c of cases) {
      expect(parse_unit(format_unit(c))).toBe(c)
    }
  })

  it("round-trips USDC amounts with decimals=6", () => {
    const human = "1234.56789"
    expect(format_unit(parse_unit(human, 6), 6)).toBe(human)
  })
})
