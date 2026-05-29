import { parse, ValiError } from "valibot"
import { describe, expect, it } from "vitest"

import {
  PaymasterDataSchema,
  PaymasterDataV06Schema,
  PaymasterDataV07Schema,
  PaymasterStubDataSchema,
  PaymasterStubDataV07Schema,
  PaymasterUserOperationSchema,
} from "./paymaster"

const SHARED_USER_OP_FIELDS = {
  sender: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  nonce: "0x0",
  callData: "0xdeadbeef",
  callGasLimit: "0x186a0",
  verificationGasLimit: "0x186a0",
  preVerificationGas: "0xc350",
  maxFeePerGas: "0x6fc23ac00",
  maxPriorityFeePerGas: "0x77359400",
} as const

describe("PaymasterStubDataSchema (v0.7 first)", () => {
  it("parses a v0.7 stub response", () => {
    const result = parse(PaymasterStubDataSchema, {
      paymaster:
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      paymasterData: "0xdeadbeef",
      paymasterVerificationGasLimit: "0xf4240",
      paymasterPostOpGasLimit: "0xea60",
      sponsor: { name: "Test Sponsor" },
      isFinal: false,
    })
    expect("paymaster" in result).toBe(true)
    if (!("paymaster" in result))
      throw new Error("v07 branch expected")
    expect(result.paymasterPostOpGasLimit).toBe("0xea60")
  })

  it("parses a v0.6 stub response", () => {
    const result = parse(PaymasterStubDataSchema, {
      paymasterAndData: "0xdeadbeef",
      isFinal: true,
    })
    expect("paymasterAndData" in result).toBe(true)
  })

  it("rejects a v0.7 payload missing the required postOp gas limit", () => {
    expect(() =>
      parse(PaymasterStubDataV07Schema, {
        paymaster:
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        paymasterData: "0xdeadbeef",
      }),
    ).toThrow(ValiError)
  })

  it("rejects a payload matching neither variant", () => {
    expect(() =>
      parse(PaymasterStubDataSchema, { foo: "bar" }),
    ).toThrow(ValiError)
  })
})

describe("PaymasterDataSchema (final, v0.7 first)", () => {
  it("parses a v0.7 final response", () => {
    const result = parse(PaymasterDataSchema, {
      paymaster:
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      paymasterData: "0xfeedface",
    })
    expect("paymaster" in result).toBe(true)
  })

  it("parses a v0.6 final response", () => {
    const result = parse(PaymasterDataSchema, {
      paymasterAndData: "0xfeedface",
    })
    expect("paymasterAndData" in result).toBe(true)
  })

  it("rejects a v0.7 payload missing paymasterData", () => {
    expect(() =>
      parse(PaymasterDataV07Schema, {
        paymaster:
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      }),
    ).toThrow(ValiError)
  })

  it("rejects a v0.6 payload with non-bytes value", () => {
    expect(() =>
      parse(PaymasterDataV06Schema, {
        paymasterAndData: "not-hex",
      }),
    ).toThrow(ValiError)
  })
})

describe("PaymasterUserOperationSchema (v0.6 first)", () => {
  it("parses a v0.6 userOp (initCode)", () => {
    const result = parse(PaymasterUserOperationSchema, {
      ...SHARED_USER_OP_FIELDS,
      initCode: "0x",
    })
    expect("initCode" in result).toBe(true)
  })

  it("parses a v0.7 userOp with factory + factoryData", () => {
    const result = parse(PaymasterUserOperationSchema, {
      ...SHARED_USER_OP_FIELDS,
      factory: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      factoryData: "0xabcd",
    })
    expect("factory" in result).toBe(true)
    expect("initCode" in result).toBe(false)
  })

  it("parses a v0.7 userOp without factory (pre-deployed account)", () => {
    const result = parse(
      PaymasterUserOperationSchema,
      SHARED_USER_OP_FIELDS,
    )
    expect("initCode" in result).toBe(false)
  })

  it("rejects a payload missing required fields", () => {
    expect(() =>
      parse(PaymasterUserOperationSchema, {
        sender: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      }),
    ).toThrow(ValiError)
  })
})
