import { bytesSchema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { is_delegation_designator } from "./designator"

describe("is_delegation_designator", () => {
  it("matches a 0xef0100-prefixed 23-byte code", () => {
    const code = parse(
      bytesSchema,
      "0xef01004c7218f68f95eec39d7d7939b819837156a11961",
    )
    expect(is_delegation_designator(code)).toBe(true)
  })

  it("rejects empty code", () => {
    const code = parse(bytesSchema, "0x")
    expect(is_delegation_designator(code)).toBe(false)
  })

  it("rejects regular contract code", () => {
    const code = parse(bytesSchema, "0x6080604052348015")
    expect(is_delegation_designator(code)).toBe(false)
  })

  it("rejects code with the prefix but wrong length", () => {
    const code = parse(bytesSchema, "0xef0100deadbeef")
    expect(is_delegation_designator(code)).toBe(false)
  })

  it("rejects a near-miss prefix", () => {
    const code = parse(
      bytesSchema,
      "0xef01014c7218f68f95eec39d7d7939b819837156a11961",
    )
    expect(is_delegation_designator(code)).toBe(false)
  })
})
