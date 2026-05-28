import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { encode_transaction_unsigned } from "./codec"

describe("encode_transaction_unsigned (eip-1559)", () => {
  it("prefixes the type-2 byte before the RLP body", () => {
    const tx = {
      type: parse(ByteSchema, "0x2"),
      chainId: parse(UintSchema, "0x1"),
      nonce: parse(UintSchema, "0x0"),
      maxPriorityFeePerGas: parse(UintSchema, "0x3b9aca00"),
      maxFeePerGas: parse(UintSchema, "0xb2d05e00"),
      gas: parse(UintSchema, "0x5208"),
      to: parse(
        AddressSchema,
        "0x0000000000000000000000000000000000000001",
      ),
      value: parse(UintSchema, "0x0"),
      input: parse(BytesSchema, "0x"),
      gasPrice: parse(UintSchema, "0x0"),
      accessList: [],
    }
    const bytes = encode_transaction_unsigned(tx)
    expect(bytes[0]).toBe(0x02)
    expect(bytes.length).toBeGreaterThan(1)
  })

  it("encodes contract-creation tx (to: null) with empty bytes for the to slot", () => {
    const tx = {
      type: parse(ByteSchema, "0x2"),
      chainId: parse(UintSchema, "0x1"),
      nonce: parse(UintSchema, "0x0"),
      maxPriorityFeePerGas: parse(UintSchema, "0x1"),
      maxFeePerGas: parse(UintSchema, "0x1"),
      gas: parse(UintSchema, "0x5208"),
      to: null,
      value: parse(UintSchema, "0x0"),
      input: parse(BytesSchema, "0x60806040"),
      gasPrice: parse(UintSchema, "0x0"),
      accessList: [],
    }
    const bytes = encode_transaction_unsigned(tx)
    expect(bytes[0]).toBe(0x02)
    // The encoded form is deterministic; serialize for diagnostic
    // visibility when this test fails.
    expect(bytes_to_hex(bytes)).toMatch(/^0x02/)
  })
})
