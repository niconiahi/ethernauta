import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type { Http } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"

import type { PaymasterUserOperation } from "../paymaster"
import { pm_getPaymasterData } from "./pm-get-paymaster-data"

const ENTRY_POINT = parse(
  AddressSchema,
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
)
const PAYMASTER = parse(
  AddressSchema,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
)
const CHAIN_ID = parse(UintSchema, "0x1")
const USER_OP: PaymasterUserOperation = {
  sender: parse(
    AddressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  nonce: parse(UintSchema, "0x0"),
  initCode: parse(BytesSchema, "0x"),
  callData: parse(BytesSchema, "0xabcd"),
  callGasLimit: parse(UintSchema, "0xea60"),
  verificationGasLimit: parse(UintSchema, "0xea60"),
  preVerificationGas: parse(UintSchema, "0x5208"),
  maxFeePerGas: parse(UintSchema, "0x3b9aca00"),
  maxPriorityFeePerGas: parse(UintSchema, "0x3b9aca00"),
}

function success_response<T>(_result: T) {
  return {
    jsonrpc: "2.0" as const,
    id: "test",
    result: _result,
  }
}

describe("pm_getPaymasterData", () => {
  it("issues a JSON-RPC call with method pm_getPaymasterData", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymaster: PAYMASTER,
        paymasterData: "0xdeadbeef",
      }),
    )
    await pm_getPaymasterData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
    })(resolver)
    const call = vi.mocked(resolver).mock.calls[0]?.[0]
    expect(call?.[0]).toBe("pm_getPaymasterData")
  })

  it("parses a v0.7 final response", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymaster: PAYMASTER,
        paymasterData: "0xdeadbeef",
      }),
    )
    const result = await pm_getPaymasterData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
    })(resolver)
    expect("paymaster" in result).toBe(true)
    if (!("paymaster" in result))
      throw new Error("v07 expected")
    expect(result.paymasterData).toBe("0xdeadbeef")
  })

  it("parses a v0.6 final response", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymasterAndData: "0xfeedface",
      }),
    )
    const result = await pm_getPaymasterData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
    })(resolver)
    expect("paymasterAndData" in result).toBe(true)
  })
})
