import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  EstimateUserOperationGasResultSchema,
  PackedUserOperationSchema,
  UserOperationReceiptSchema,
  UserOperationSchema,
} from "./types"

const ADDR =
  "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845" as const
const HASH =
  "0xdb9a5f2320c0a10d28bfa1c563a1bbf592665e9b5d0bf41f4a9a4a64bb1a8b22" as const
const B32 = `0x${"00".repeat(32)}` as const

describe("types.ts — UserOperationSchema", () => {
  it("should accept a minimal RPC user op", () => {
    expect(() =>
      parse(UserOperationSchema, {
        sender: ADDR,
        nonce: "0x0",
        callData: "0x",
        callGasLimit: "0x0",
        verificationGasLimit: "0x0",
        preVerificationGas: "0x0",
        maxFeePerGas: "0x0",
        maxPriorityFeePerGas: "0x0",
        signature: "0x",
      }),
    ).not.toThrow()
  })

  it("should accept a paymastered user op", () => {
    expect(() =>
      parse(UserOperationSchema, {
        sender: ADDR,
        nonce: "0x0",
        factory: ADDR,
        factoryData: "0xdeadbeef",
        callData: "0xabcd",
        callGasLimit: "0x100",
        verificationGasLimit: "0x100",
        preVerificationGas: "0x100",
        maxFeePerGas: "0x10",
        maxPriorityFeePerGas: "0x1",
        paymaster: ADDR,
        paymasterVerificationGasLimit: "0x100",
        paymasterPostOpGasLimit: "0x100",
        paymasterData: "0x",
        signature: "0x",
      }),
    ).not.toThrow()
  })

  it("should reject when sender is malformed", () => {
    expect(() =>
      parse(UserOperationSchema, {
        sender: "0x123",
        nonce: "0x0",
        callData: "0x",
        callGasLimit: "0x0",
        verificationGasLimit: "0x0",
        preVerificationGas: "0x0",
        maxFeePerGas: "0x0",
        maxPriorityFeePerGas: "0x0",
        signature: "0x",
      }),
    ).toThrow()
  })
})

describe("types.ts — PackedUserOperationSchema", () => {
  it("should accept the canonical EntryPoint shape", () => {
    expect(() =>
      parse(PackedUserOperationSchema, {
        sender: ADDR,
        nonce: "0x0",
        initCode: "0x",
        callData: "0x",
        accountGasLimits: B32,
        preVerificationGas: "0x0",
        gasFees: B32,
        paymasterAndData: "0x",
        signature: "0x",
      }),
    ).not.toThrow()
  })
})

describe("types.ts — EstimateUserOperationGasResultSchema", () => {
  it("should accept a base estimate result", () => {
    expect(() =>
      parse(EstimateUserOperationGasResultSchema, {
        preVerificationGas: "0x100",
        verificationGasLimit: "0x100",
        callGasLimit: "0x100",
      }),
    ).not.toThrow()
  })

  it("should accept paymaster fields when present", () => {
    expect(() =>
      parse(EstimateUserOperationGasResultSchema, {
        preVerificationGas: "0x100",
        verificationGasLimit: "0x100",
        callGasLimit: "0x100",
        paymasterVerificationGasLimit: "0x100",
        paymasterPostOpGasLimit: "0x100",
      }),
    ).not.toThrow()
  })
})

describe("types.ts — UserOperationReceiptSchema", () => {
  it("should accept a minimal receipt", () => {
    expect(() =>
      parse(UserOperationReceiptSchema, {
        userOpHash: HASH,
        entryPoint: ADDR,
        sender: ADDR,
        nonce: "0x0",
        actualGasCost: "0x0",
        actualGasUsed: "0x0",
        logs: [],
        receipt: {
          transactionHash: HASH,
          blockHash: HASH,
          blockNumber: "0x1",
        },
      }),
    ).not.toThrow()
  })
})
