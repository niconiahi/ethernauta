// Vectors from the Ethereum yellow paper / RLP spec.
import { describe, expect, it } from "vitest"
import { bytes_to_hex } from "./bytes-to-hex"
import { hex_to_bytes } from "./hex-to-bytes"
import {
  type RlpDecoded,
  rlp_decode,
  rlp_encode,
} from "./rlp"

function hex(
  input: Parameters<typeof rlp_encode>[0],
): string {
  return bytes_to_hex(rlp_encode(input))
}

function decode_hex(input: `0x${string}`): RlpDecoded {
  return rlp_decode(hex_to_bytes(input))
}

type HexTree = string | HexTree[]
function to_hex_tree(value: RlpDecoded): HexTree {
  if (value instanceof Uint8Array)
    return bytes_to_hex(value)
  return value.map(to_hex_tree)
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

  it("should decode 0x80 as the empty byte string", () => {
    expect(to_hex_tree(decode_hex("0x80"))).toBe("0x")
  })

  it("should decode 0xc0 as the empty list", () => {
    expect(to_hex_tree(decode_hex("0xc0"))).toEqual([])
  })

  it("should decode a single byte < 0x80 as itself", () => {
    expect(to_hex_tree(decode_hex("0x00"))).toBe("0x00")
    expect(to_hex_tree(decode_hex("0x7f"))).toBe("0x7f")
  })

  it("should decode 0x83646f67 as 'dog' bytes", () => {
    expect(to_hex_tree(decode_hex("0x83646f67"))).toBe(
      "0x646f67",
    )
  })

  it("should decode the list ['cat', 'dog']", () => {
    expect(
      to_hex_tree(decode_hex("0xc88363617483646f67")),
    ).toEqual(["0x636174", "0x646f67"])
  })

  it("should decode the integer 1024 (0x820400) as 0x0400", () => {
    expect(to_hex_tree(decode_hex("0x820400"))).toBe(
      "0x0400",
    )
  })

  it("should decode a long string (0xb7+ prefix)", () => {
    const long =
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
    const encoded = rlp_encode(long)
    const decoded = rlp_decode(encoded)
    expect(decoded).toBeInstanceOf(Uint8Array)
    if (decoded instanceof Uint8Array) {
      expect(new TextDecoder().decode(decoded)).toBe(long)
    }
  })

  it("should decode the nested-lists vector 0xc7c0c1c0c3c0c1c0", () => {
    expect(
      to_hex_tree(decode_hex("0xc7c0c1c0c3c0c1c0")),
    ).toEqual([[], [[]], [[], [[]]]])
  })

  it("should round-trip a long list (0xf8+ prefix)", () => {
    // 30 two-byte items encode to 3 bytes each → 90-byte
    // payload → long-list prefix (0xf8+).
    const items = Array.from(
      { length: 30 },
      (_, i) => new Uint8Array([0x80, i & 0xff]),
    )
    const encoded = rlp_encode(items)
    expect(encoded[0]).toBeGreaterThanOrEqual(0xf8)
    const decoded = rlp_decode(encoded)
    expect(Array.isArray(decoded)).toBe(true)
    if (Array.isArray(decoded)) {
      expect(decoded).toHaveLength(30)
      for (let i = 0; i < 30; i++) {
        const item = decoded[i]
        expect(item).toBeInstanceOf(Uint8Array)
        if (item instanceof Uint8Array) {
          expect(item[1]).toBe(i & 0xff)
        }
      }
    }
  })

  it("should round-trip a 32-byte bigint", () => {
    const big = 1n << 248n
    const encoded = rlp_encode(big)
    const decoded = rlp_decode(encoded)
    expect(decoded).toBeInstanceOf(Uint8Array)
    if (decoded instanceof Uint8Array) {
      expect(decoded.length).toBe(32)
      expect(decoded[0]).toBe(0x01)
    }
  })

  it("should throw on trailing bytes", () => {
    expect(() =>
      rlp_decode(hex_to_bytes("0x8000")),
    ).toThrow(/trailing/)
  })

  it("should throw when the payload overruns the input", () => {
    expect(() =>
      rlp_decode(hex_to_bytes("0x83ab")),
    ).toThrow(/overruns/)
  })

  it("should throw on empty input", () => {
    expect(() => rlp_decode(new Uint8Array(0))).toThrow(
      /unexpected end/,
    )
  })
})
