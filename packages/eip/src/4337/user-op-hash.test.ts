import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { ENTRY_POINT_V07_ADDRESS } from "./constants"
import type { UserOperation } from "./types"
import {
  get_user_op_hash,
  inner_user_op_hash,
} from "./user-op-hash"

const ZERO_HEX_64 = parse(
  Bytes32Schema,
  `0x${"00".repeat(32)}`,
)
const ZERO_UINT = parse(UintSchema, "0x0")
const ONE_UINT = parse(UintSchema, "0x1")
const SEPOLIA_CHAIN_ID = parse(UintSchema, "0xaa36a7")
const EMPTY_BYTES = parse(BytesSchema, "0x")

const EMPTY_OP: UserOperation = {
  sender: parse(
    AddressSchema,
    "0x0000000000000000000000000000000000000001",
  ),
  nonce: ZERO_UINT,
  callData: EMPTY_BYTES,
  callGasLimit: ZERO_UINT,
  verificationGasLimit: ZERO_UINT,
  preVerificationGas: ZERO_UINT,
  maxFeePerGas: ZERO_UINT,
  maxPriorityFeePerGas: ZERO_UINT,
  signature: EMPTY_BYTES,
}

describe("user-op-hash.ts — get_user_op_hash", () => {
  it("should produce a 32-byte hex hash", () => {
    const hash = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: SEPOLIA_CHAIN_ID,
    })
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
  })

  it("should be deterministic for identical inputs", () => {
    const a = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: ONE_UINT,
    })
    const b = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: ONE_UINT,
    })
    expect(a).toBe(b)
  })

  it("should differ across chains", () => {
    const sepolia = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: SEPOLIA_CHAIN_ID,
    })
    const mainnet = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: ONE_UINT,
    })
    expect(sepolia).not.toBe(mainnet)
  })

  it("should differ when nonce changes", () => {
    const zero = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: ONE_UINT,
    })
    const one = get_user_op_hash({
      op: { ...EMPTY_OP, nonce: ONE_UINT },
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: ONE_UINT,
    })
    expect(zero).not.toBe(one)
  })

  it("should differ when entryPoint changes", () => {
    const a = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: ENTRY_POINT_V07_ADDRESS,
      chainId: ONE_UINT,
    })
    const b = get_user_op_hash({
      op: EMPTY_OP,
      entryPoint: parse(
        AddressSchema,
        "0x000000000000000000000000000000000000DEAD",
      ),
      chainId: ONE_UINT,
    })
    expect(a).not.toBe(b)
  })
})

describe("user-op-hash.ts — inner_user_op_hash", () => {
  it("should hash a fully zero packed op deterministically", () => {
    const inner = inner_user_op_hash({
      sender: parse(
        AddressSchema,
        "0x0000000000000000000000000000000000000000",
      ),
      nonce: ZERO_UINT,
      initCode: EMPTY_BYTES,
      callData: EMPTY_BYTES,
      accountGasLimits: ZERO_HEX_64,
      preVerificationGas: ZERO_UINT,
      gasFees: ZERO_HEX_64,
      paymasterAndData: EMPTY_BYTES,
      signature: EMPTY_BYTES,
    })
    expect(inner).toMatch(/^0x[0-9a-f]{64}$/)
  })
})
