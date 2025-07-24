import { describe, expect, it } from "vitest"

import { bigToUint } from "./big-to-uint"

describe("uintToBig", () => {
  it("should correctly transform the big int 6715 into hexadecimal", () => {
    const big = BigInt("6715")
    const uint = bigToUint(big)
    expect(uint).toBe("0x1a3b")
  })
})
