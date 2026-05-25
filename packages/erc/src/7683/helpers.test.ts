import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  address_to_bytes32,
  build_gasless_order,
  compute_deadlines,
  random_nonce,
  strip_hex_zeros,
} from "./helpers"

const B32_ZERO = parse(
  bytes32Schema,
  `0x${"00".repeat(32)}`,
)

describe("helpers.ts — address_to_bytes32", () => {
  it("should left-pad an address to 32 bytes", () => {
    const padded = address_to_bytes32(
      parse(
        addressSchema,
        "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
      ),
    )
    expect(padded).toBe(
      "0x000000000000000000000000fa3a1d0c75a8d44a8dcd8c8dfcdcd52dbfdab845",
    )
    expect(padded.length).toBe(66)
  })
})

describe("helpers.ts — compute_deadlines", () => {
  it("should compute deadlines from a fixed now", () => {
    const { openDeadline, fillDeadline } =
      compute_deadlines(
        { open_window_s: 60, fill_window_s: 600 },
        1_700_000_000,
      )
    expect(BigInt(openDeadline)).toBe(1_700_000_060n)
    expect(BigInt(fillDeadline)).toBe(1_700_000_600n)
  })
})

describe("helpers.ts — random_nonce", () => {
  it("should produce a 32-byte hex string", () => {
    const nonce = random_nonce()
    expect(nonce.length).toBe(66)
    expect(/^0x[0-9a-f]{64}$/.test(nonce)).toBe(true)
  })

  it("should produce different values on successive calls", () => {
    expect(random_nonce()).not.toBe(random_nonce())
  })
})

describe("helpers.ts — strip_hex_zeros", () => {
  it("should strip leading zeros", () => {
    expect(strip_hex_zeros("0x000001")).toBe("0x1")
  })
  it("should preserve a single zero", () => {
    expect(strip_hex_zeros("0x00")).toBe("0x0")
  })
})

describe("helpers.ts — build_gasless_order", () => {
  it("should assemble a gasless order with computed deadlines", () => {
    const order = build_gasless_order({
      originSettler: parse(
        addressSchema,
        "0x1111111111111111111111111111111111111111",
      ),
      user: parse(
        addressSchema,
        "0x2222222222222222222222222222222222222222",
      ),
      originChainId: parse(uint256Schema, "0xaa36a7"),
      orderDataType: B32_ZERO,
      orderData: parse(bytesSchema, "0x"),
      window: { open_window_s: 60, fill_window_s: 600 },
      nonce: parse(uint256Schema, "0x1"),
    })
    expect(order.originSettler).toBe(
      "0x1111111111111111111111111111111111111111",
    )
    expect(order.nonce).toBe("0x1")
    expect(BigInt(order.fillDeadline)).toBeGreaterThan(
      BigInt(order.openDeadline),
    )
  })
})
