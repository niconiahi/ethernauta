import { describe, expect, it } from "vitest"

import { uintToBig } from "./uint-to-big"

describe("uintToBig", () => {
  it("should correctly transform the hexadecimal number 6715 into big int", () => {
    const uint = "0x1A3B"
    const big = uintToBig(uint)
    expect(big.toString()).toBe("6715")
  })
})
