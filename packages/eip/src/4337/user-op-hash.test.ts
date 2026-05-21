import { describe, expect, it } from "vitest"

import { ENTRY_POINT_V07_ADDRESS } from "./constants"
import type { UserOperation } from "./types"
import {
  get_user_op_hash,
  inner_user_op_hash,
} from "./user-op-hash"

const ZERO_HEX_64 = `0x${"00".repeat(32)}` as const

const EMPTY_OP: UserOperation = {
  sender: "0x0000000000000000000000000000000000000001",
  nonce: "0x0",
  callData: "0x",
  callGasLimit: "0x0",
  verificationGasLimit: "0x0",
  preVerificationGas: "0x0",
  maxFeePerGas: "0x0",
  maxPriorityFeePerGas: "0x0",
  signature: "0x",
}

describe("user-op-hash.ts — get_user_op_hash", () => {
  it("should produce a 32-byte hex hash", () => {
    const hash = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0xaa36a7",
    })
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
  })

  it("should be deterministic for identical inputs", () => {
    const a = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0x1",
    })
    const b = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0x1",
    })
    expect(a).toBe(b)
  })

  it("should differ across chains", () => {
    const sepolia = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0xaa36a7",
    })
    const mainnet = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0x1",
    })
    expect(sepolia).not.toBe(mainnet)
  })

  it("should differ when nonce changes", () => {
    const zero = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0x1",
    })
    const one = get_user_op_hash({
      op: { ...EMPTY_OP, nonce: "0x1" },
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0x1",
    })
    expect(zero).not.toBe(one)
  })

  it("should differ when entryPoint changes", () => {
    const a = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: "0x1",
    })
    const b = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint:
        "0x000000000000000000000000000000000000DEAD",
      chainId: "0x1",
    })
    expect(a).not.toBe(b)
  })
})

describe("user-op-hash.ts — inner_user_op_hash", () => {
  it("should hash a fully zero packed op deterministically", () => {
    const inner = inner_user_op_hash({
      sender: "0x0000000000000000000000000000000000000000",
      nonce: "0x0",
      initCode: "0x",
      callData: "0x",
      accountGasLimits: ZERO_HEX_64,
      preVerificationGas: "0x0",
      gasFees: ZERO_HEX_64,
      paymasterAndData: "0x",
      signature: "0x",
    })
    expect(inner).toMatch(/^0x[0-9a-f]{64}$/)
  })
})
