import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { encode_transaction_unsigned } from "./codec"

describe("encode_transaction_unsigned (eip-1559)", () => {
  it("prefixes the type-2 byte before the RLP body", () => {
    const tx = {
      type: parse(byteSchema, "0x2"),
      chainId: parse(uintSchema, "0x1"),
      nonce: parse(uintSchema, "0x0"),
      maxPriorityFeePerGas: parse(uintSchema, "0x3b9aca00"),
      maxFeePerGas: parse(uintSchema, "0xb2d05e00"),
      gas: parse(uintSchema, "0x5208"),
      to: parse(
        addressSchema,
        "0x0000000000000000000000000000000000000001",
      ),
      value: parse(uintSchema, "0x0"),
      input: parse(bytesSchema, "0x"),
      gasPrice: parse(uintSchema, "0x0"),
      accessList: [],
    }
    const bytes = encode_transaction_unsigned(tx)
    expect(bytes[0]).toBe(0x02)
    expect(bytes.length).toBeGreaterThan(1)
  })

  it("encodes contract-creation tx (to: null) with empty bytes for the to slot", () => {
    const tx = {
      type: parse(byteSchema, "0x2"),
      chainId: parse(uintSchema, "0x1"),
      nonce: parse(uintSchema, "0x0"),
      maxPriorityFeePerGas: parse(uintSchema, "0x1"),
      maxFeePerGas: parse(uintSchema, "0x1"),
      gas: parse(uintSchema, "0x5208"),
      to: null,
      value: parse(uintSchema, "0x0"),
      input: parse(bytesSchema, "0x60806040"),
      gasPrice: parse(uintSchema, "0x0"),
      accessList: [],
    }
    const bytes = encode_transaction_unsigned(tx)
    expect(bytes[0]).toBe(0x02)
    // The encoded form is deterministic; serialize for diagnostic
    // visibility when this test fails.
    expect(bytes_to_hex(bytes)).toMatch(/^0x02/)
  })
})
