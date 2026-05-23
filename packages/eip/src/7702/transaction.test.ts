import { bytes_to_hex } from "@ethernauta/utils"
import { describe, expect, it } from "vitest"
import {
  encode_set_code_signed,
  encode_set_code_unsigned,
  SET_CODE_TX_TYPE,
  type SetCodeTransactionSigned,
  type SetCodeTransactionUnsigned,
} from "."

const BASE: SetCodeTransactionUnsigned = {
  chainId: 1n,
  nonce: 0n,
  maxPriorityFeePerGas: 1_000_000_000n,
  maxFeePerGas: 30_000_000_000n,
  gasLimit: 100_000n,
  to: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
  value: 0n,
  data: new Uint8Array([0xa9, 0x05, 0x9c, 0xbb]),
  accessList: [],
  authorizationList: [
    {
      chainId: "0x1",
      address: "0x1234567890123456789012345678901234567890",
      nonce: "0x0",
      yParity: "0x0",
      r: "0xabcd",
      s: "0xef01",
    },
  ],
}

describe("transaction.ts", () => {
  it("should prefix the encoding with the 0x04 type byte", () => {
    const encoded = encode_set_code_unsigned(BASE)
    expect(encoded[0]).toBe(SET_CODE_TX_TYPE)
  })

  it("should be deterministic across calls", () => {
    const a = bytes_to_hex(encode_set_code_unsigned(BASE))
    const b = bytes_to_hex(encode_set_code_unsigned(BASE))
    expect(a).toBe(b)
  })

  it("should produce a different encoding for signed vs unsigned", () => {
    const unsigned = bytes_to_hex(
      encode_set_code_unsigned(BASE),
    )
    const signed: SetCodeTransactionSigned = {
      ...BASE,
      yParity: 0n,
      r: 0xabcdn,
      s: 0xef01n,
    }
    const signed_hex = bytes_to_hex(
      encode_set_code_signed(signed),
    )
    expect(signed_hex).not.toBe(unsigned)
    expect(signed_hex.length).toBeGreaterThan(
      unsigned.length,
    )
  })

  it("should encode an empty authorization_list as 0xc0", () => {
    const empty = {
      ...BASE,
      authorizationList: [],
    }
    const hex = bytes_to_hex(
      encode_set_code_unsigned(empty),
    )
    // Find the 0xc0 (empty list) appearing after the
    // empty accessList. There should be two 0xc0 bytes
    // in sequence near the tail of the encoding.
    expect(hex.includes("c0c0")).toBe(true)
  })

  it("should grow proportionally with authorization count", () => {
    const one = encode_set_code_unsigned(BASE).length
    const three = encode_set_code_unsigned({
      ...BASE,
      authorizationList: [
        BASE.authorizationList[0]!,
        BASE.authorizationList[0]!,
        BASE.authorizationList[0]!,
      ],
    }).length
    expect(three).toBeGreaterThan(one)
  })
})
