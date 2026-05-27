import {
  addressSchema,
  byteSchema,
  bytesSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import type { AuthorizationSigned } from "./authorization"
import { SET_CODE_TX_TYPE } from "./authorization"
import {
  decode_transaction_signed,
  decode_transaction_unsigned,
  encode_transaction_signed,
  encode_transaction_unsigned,
} from "./codec"
import type {
  Transaction7702Signed,
  Transaction7702Unsigned,
} from "./transaction"

const AUTH: AuthorizationSigned = {
  chainId: parse(uintSchema, "0x1"),
  address: parse(
    addressSchema,
    "0x1234567890123456789012345678901234567890",
  ),
  nonce: parse(uintSchema, "0x0"),
  yParity: parse(uintSchema, "0x0"),
  r: parse(uintSchema, "0xabcd"),
  s: parse(uintSchema, "0xef01"),
}

const BASE: Transaction7702Unsigned = {
  type: parse(byteSchema, "0x4"),
  chainId: parse(uintSchema, "0x1"),
  nonce: parse(uintSchema, "0x0"),
  maxPriorityFeePerGas: parse(uintSchema, "0x3b9aca00"),
  maxFeePerGas: parse(uintSchema, "0x6fc23ac00"),
  gas: parse(uintSchema, "0x186a0"),
  to: parse(
    addressSchema,
    "0xfa3a1d0c75a8d44a8dcd8c8dfcdcd52dbfdab845",
  ),
  value: parse(uintSchema, "0x0"),
  input: parse(bytesSchema, "0xa9059cbb"),
  accessList: [],
  authorizationList: [AUTH],
}

describe("codec.ts — encode", () => {
  it("should prefix the unsigned encoding with the 0x04 type byte", () => {
    const encoded = encode_transaction_unsigned(BASE)
    expect(encoded[0]).toBe(SET_CODE_TX_TYPE)
  })

  it("should be deterministic across calls", () => {
    const a = bytes_to_hex(
      encode_transaction_unsigned(BASE),
    )
    const b = bytes_to_hex(
      encode_transaction_unsigned(BASE),
    )
    expect(a).toBe(b)
  })

  it("should produce a different encoding for signed vs unsigned", () => {
    const unsigned = bytes_to_hex(
      encode_transaction_unsigned(BASE),
    )
    const signed: Transaction7702Signed = {
      ...BASE,
      yParity: parse(uintSchema, "0x0"),
      r: parse(uintSchema, "0xabcd"),
      s: parse(uintSchema, "0xef01"),
    }
    const signed_hex = bytes_to_hex(
      encode_transaction_signed(signed),
    )
    expect(signed_hex).not.toBe(unsigned)
    expect(signed_hex.length).toBeGreaterThan(
      unsigned.length,
    )
  })

  it("should encode an empty authorization_list as 0xc0", () => {
    const empty: Transaction7702Unsigned = {
      ...BASE,
      authorizationList: [],
    }
    const hex = bytes_to_hex(
      encode_transaction_unsigned(empty),
    )
    // Two empty lists (accessList + authorizationList) at the
    // tail of the unsigned encoding.
    expect(hex.includes("c0c0")).toBe(true)
  })

  it("should grow proportionally with authorization count", () => {
    const one = encode_transaction_unsigned(BASE).length
    const three = encode_transaction_unsigned({
      ...BASE,
      authorizationList: [AUTH, AUTH, AUTH],
    }).length
    expect(three).toBeGreaterThan(one)
  })
})

describe("codec.ts — decode", () => {
  it("should round-trip an unsigned transaction", () => {
    const encoded = encode_transaction_unsigned(BASE)
    const decoded = decode_transaction_unsigned(encoded)
    expect(decoded).toEqual(BASE)
  })

  it("should round-trip a signed transaction", () => {
    const signed: Transaction7702Signed = {
      ...BASE,
      yParity: parse(uintSchema, "0x1"),
      r: parse(
        uintSchema,
        "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      ),
      s: parse(
        uintSchema,
        "0xcafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe",
      ),
    }
    const encoded = encode_transaction_signed(signed)
    const decoded = decode_transaction_signed(encoded)
    expect(decoded).toEqual(signed)
  })

  it("should round-trip a tx with a non-empty access list", () => {
    const tx: Transaction7702Unsigned = {
      ...BASE,
      accessList: [
        {
          address: parse(
            addressSchema,
            "0xfa3a1d0c75a8d44a8dcd8c8dfcdcd52dbfdab845",
          ),
          storageKeys: [
            parse(hash32Schema, `0x${"00".repeat(31)}01`),
            parse(hash32Schema, `0x${"00".repeat(31)}02`),
          ],
        },
      ],
      authorizationList: [],
    }
    const encoded = encode_transaction_unsigned(tx)
    const decoded = decode_transaction_unsigned(encoded)
    expect(decoded.accessList).toHaveLength(1)
    expect(decoded.accessList[0]?.address).toBe(
      tx.accessList[0]?.address,
    )
    expect(decoded.accessList[0]?.storageKeys).toEqual(
      tx.accessList[0]?.storageKeys,
    )
  })

  it("should reject bytes without the 0x04 type prefix", () => {
    expect(() =>
      decode_transaction_signed(
        new Uint8Array([0x02, 0xc0]),
      ),
    ).toThrow(/0x04 type prefix/)
  })

  it("should reject signed-decode when the body has 10 fields", () => {
    const encoded = encode_transaction_unsigned(BASE)
    expect(() =>
      decode_transaction_signed(encoded),
    ).toThrow(/expected 13 fields/)
  })

  it("should reject unsigned-decode when the body has 13 fields", () => {
    const signed: Transaction7702Signed = {
      ...BASE,
      yParity: parse(uintSchema, "0x0"),
      r: parse(uintSchema, "0x1"),
      s: parse(uintSchema, "0x1"),
    }
    const encoded = encode_transaction_signed(signed)
    expect(() =>
      decode_transaction_unsigned(encoded),
    ).toThrow(/expected 10 fields/)
  })
})
