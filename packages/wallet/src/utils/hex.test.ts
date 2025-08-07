import { describe, expect, it } from "vitest"
import { bytes_to_hex, hex_to_bytes } from "./hex"

describe("hex.ts", () => {
  it("should encode correct data", () => {
    const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    for (const length of cases) {
      const data = crypto.getRandomValues(
        new Uint8Array(length),
      )
      expect(bytes_to_hex(data)).toBe(
        `0x${Array.from(data)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")}`,
      )
    }
  })
  it("should decode correct data", () => {
    for (let i = 0; i < 100; i++) {
      const data = crypto.getRandomValues(new Uint8Array(i))
      expect(
        hex_to_bytes(bytes_to_hex(data)),
      ).toStrictEqual(data)
    }
  })
  it("should throw an error if data is invalid", () => {
    expect(() => hex_to_bytes("a")).toThrowError()
    expect(() => hex_to_bytes("x")).toThrowError()
  })
})
