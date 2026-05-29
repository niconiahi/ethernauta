import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type { UserOperation } from "@ethernauta/eip/4337"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { apply_to_user_op } from "./apply-to-user-op"

const PAYMASTER = parse(
  AddressSchema,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
)

const BASE_OP: UserOperation = {
  sender: parse(
    AddressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  nonce: parse(UintSchema, "0x0"),
  callData: parse(BytesSchema, "0xabcd"),
  callGasLimit: parse(UintSchema, "0xea60"),
  verificationGasLimit: parse(UintSchema, "0xea60"),
  preVerificationGas: parse(UintSchema, "0x5208"),
  maxFeePerGas: parse(UintSchema, "0x3b9aca00"),
  maxPriorityFeePerGas: parse(UintSchema, "0x3b9aca00"),
  signature: parse(BytesSchema, "0x"),
}

describe("apply_to_user_op", () => {
  it("merges v0.7 stub fields onto the op", () => {
    const stub = {
      paymaster: PAYMASTER,
      paymasterData: parse(BytesSchema, "0xdeadbeef"),
      paymasterVerificationGasLimit: parse(
        UintSchema,
        "0xf4240",
      ),
      paymasterPostOpGasLimit: parse(UintSchema, "0xea60"),
    }
    const next = apply_to_user_op(BASE_OP, stub)
    expect(next.paymaster).toBe(PAYMASTER)
    expect(next.paymasterData).toBe("0xdeadbeef")
    expect(next.paymasterVerificationGasLimit).toBe(
      "0xf4240",
    )
    expect(next.paymasterPostOpGasLimit).toBe("0xea60")
  })

  it("preserves stub-discovered gas limits when merging final data", () => {
    const after_stub = apply_to_user_op(BASE_OP, {
      paymaster: PAYMASTER,
      paymasterData: parse(BytesSchema, "0xaaaa"),
      paymasterVerificationGasLimit: parse(
        UintSchema,
        "0xf4240",
      ),
      paymasterPostOpGasLimit: parse(UintSchema, "0xea60"),
    })
    const final = apply_to_user_op(after_stub, {
      paymaster: PAYMASTER,
      paymasterData: parse(BytesSchema, "0xbbbb"),
    })
    expect(final.paymasterData).toBe("0xbbbb")
    expect(final.paymasterVerificationGasLimit).toBe(
      "0xf4240",
    )
    expect(final.paymasterPostOpGasLimit).toBe("0xea60")
  })

  it("throws on a v0.6 paymasterAndData response", () => {
    expect(() =>
      apply_to_user_op(BASE_OP, {
        paymasterAndData: parse(BytesSchema, "0xdeadbeef"),
      }),
    ).toThrow(/v0\.6/)
  })
})
