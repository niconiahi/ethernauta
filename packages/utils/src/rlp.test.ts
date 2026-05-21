// Vectors from the Ethereum yellow paper / RLP spec.
import { describe, expect, it } from "vitest"
import { bytes_to_hex } from "./bytes-to-hex"
import { rlp_encode } from "./rlp"

function hex(
  input: Parameters<typeof rlp_encode>[0],
): string {
  return bytes_to_hex(rlp_encode(input))
}

describe("rlp.ts", () => {
  it("should encode the empty string as 0x80", () => {
    expect(hex(new Uint8Array(0))).toBe("0x80")
  })

  it("should encode the empty list as 0xc0", () => {
    expect(hex([])).toBe("0xc0")
  })

  it("should encode a single byte < 0x80 as itself", () => {
    expect(hex(new Uint8Array([0x00]))).toBe("0x00")
    expect(hex(new Uint8Array([0x7f]))).toBe("0x7f")
  })

  it("should encode the short string 'dog'", () => {
    expect(hex("dog")).toBe("0x83646f67")
  })

  it("should encode the list ['cat', 'dog']", () => {
    expect(hex(["cat", "dog"])).toBe("0xc88363617483646f67")
  })

  it("should encode the integer 0 as the empty byte string", () => {
    expect(hex(0)).toBe("0x80")
    expect(hex(0n)).toBe("0x80")
  })

  it("should encode the integer 15 as 0x0f", () => {
    expect(hex(15)).toBe("0x0f")
  })

  it("should encode the integer 1024 as 0x820400", () => {
    expect(hex(1024)).toBe("0x820400")
  })

  it("should encode a long string with the 0xb7+length prefix", () => {
    const long =
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
    expect(hex(long).startsWith("0xb8")).toBe(true)
    expect(hex(long).slice(0, 6)).toBe("0xb838")
  })

  it("should encode a nested set of lists per the spec", () => {
    expect(hex([[], [[]], [[], [[]]]])).toBe(
      "0xc7c0c1c0c3c0c1c0",
    )
  })

  it("should encode a 32-byte bigint with 0xa0 prefix", () => {
    // 2^248 — exactly 32 bytes → prefix is 0x80 + 32 = 0xa0
    expect(hex(1n << 248n).slice(0, 4)).toBe("0xa0")
  })
})
