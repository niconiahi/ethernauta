import { describe, expect, it } from "vitest"

import { ens_normalize } from "./normalize"

describe("normalize.ts — basic ascii", () => {
  it("should normalize plain ascii names", () => {
    expect(ens_normalize("vitalik.eth")).toBe("vitalik.eth")
    expect(ens_normalize("nick.eth")).toBe("nick.eth")
    expect(ens_normalize("abc.eth")).toBe("abc.eth")
  })

  it("should lowercase ascii", () => {
    expect(ens_normalize("VITALIK.ETH")).toBe("vitalik.eth")
    expect(ens_normalize("Nick.Eth")).toBe("nick.eth")
  })

  it("should accept digits and hyphens", () => {
    expect(ens_normalize("abc-123.eth")).toBe("abc-123.eth")
    expect(ens_normalize("123.eth")).toBe("123.eth")
  })

  it("should accept leading underscore", () => {
    expect(ens_normalize("_admin.eth")).toBe("_admin.eth")
    expect(ens_normalize("__test.eth")).toBe("__test.eth")
  })
})

describe("normalize.ts — errors", () => {
  it("should pass empty input through", () => {
    // Per the ENSIP-15 reference suite, empty input is
    // valid and normalises to empty (it represents the
    // root domain).
    expect(ens_normalize("")).toBe("")
  })

  it("should reject empty label", () => {
    expect(() => ens_normalize(".eth")).toThrow()
    expect(() => ens_normalize("abc..eth")).toThrow()
  })

  it("should reject non-leading underscore", () => {
    expect(() => ens_normalize("a_b.eth")).toThrow()
    expect(() => ens_normalize("abc_.eth")).toThrow()
  })

  it("should reject hyphens at positions 3,4 in ascii", () => {
    expect(() => ens_normalize("ab--cd.eth")).toThrow()
  })

  it("should reject disallowed code points", () => {
    // U+0020 SPACE is disallowed in ENS labels.
    expect(() => ens_normalize("a b.eth")).toThrow()
    // U+0040 @ is disallowed.
    expect(() => ens_normalize("a@b.eth")).toThrow()
    // U+007B { is disallowed.
    expect(() => ens_normalize("a{b.eth")).toThrow()
  })
})

describe("normalize.ts — unicode", () => {
  it("should accept basic unicode names", () => {
    // Greek
    expect(ens_normalize("αιθηρ.eth")).toBe("αιθηρ.eth")
    // Cyrillic
    expect(ens_normalize("привет.eth")).toBe("привет.eth")
  })

  it("should reject script mixing", () => {
    // Latin + Greek in same label
    expect(() => ens_normalize("aαbβ.eth")).toThrow()
  })
})

describe("normalize.ts — emoji", () => {
  // ens_normalize emits the FE0F-stripped form. For the
  // display form (with FE0F), use ens_beautify.
  it("should accept canonical emoji names", () => {
    expect(ens_normalize("🚀.eth")).toBe("🚀.eth")
  })

  it("should accept emoji + ascii labels", () => {
    expect(ens_normalize("🚀rocket.eth")).toBe(
      "🚀rocket.eth",
    )
  })

  it("should split labels on stop between emoji", () => {
    expect(ens_normalize("🚀.🌕.eth")).toBe(
      "🚀.🌕.eth",
    )
  })

  it("should strip incoming FE0F", () => {
    expect(ens_normalize("\u{1F680}\u{FE0F}.eth")).toBe(
      "🚀.eth",
    )
  })
})

describe("normalize.ts — disallowed look-alikes", () => {
  // U+FF0E FULLWIDTH FULL STOP is NOT mapped to ASCII
  // period; ENSIP-15 only recognises U+002E as a label
  // separator.
  it("should reject FF0E (fullwidth stop)", () => {
    expect(() => ens_normalize("abc．eth")).toThrow()
  })
})
