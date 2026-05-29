import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import {
  type Http,
  RpcRequestError,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"

import type { PaymasterUserOperation } from "../paymaster"
import { pm_getPaymasterStubData } from "./pm-get-paymaster-stub-data"

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

function error_response<D>(
  _code: number,
  _message: string,
  _data?: D,
) {
  return {
    jsonrpc: "2.0" as const,
    id: "test",
    error: { code: _code, message: _message, data: _data },
  }
}

describe("pm_getPaymasterStubData", () => {
  it("issues a JSON-RPC call with the spec-shaped params", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymaster: PAYMASTER,
        paymasterData: "0xdeadbeef",
        paymasterPostOpGasLimit: "0xea60",
      }),
    )
    await pm_getPaymasterStubData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
    })(resolver)
    expect(resolver).toHaveBeenCalledOnce()
    const call = vi.mocked(resolver).mock.calls[0]?.[0]
    expect(call?.[0]).toBe("pm_getPaymasterStubData")
    expect(call?.[1]).toEqual([
      USER_OP,
      ENTRY_POINT,
      CHAIN_ID,
      {},
    ])
  })

  it("forwards a caller-provided context object", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymasterAndData: "0xdeadbeef",
      }),
    )
    await pm_getPaymasterStubData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
      context: { policyId: "abc123" },
    })(resolver)
    const call = vi.mocked(resolver).mock.calls[0]?.[0]
    const params = call?.[1]
    if (!Array.isArray(params)) {
      throw new Error("expected positional params")
    }
    expect(params[3]).toEqual({ policyId: "abc123" })
  })

  it("parses a v0.7 stub response", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymaster: PAYMASTER,
        paymasterData: "0xdeadbeef",
        paymasterVerificationGasLimit: "0xf4240",
        paymasterPostOpGasLimit: "0xea60",
        sponsor: { name: "Test" },
      }),
    )
    const result = await pm_getPaymasterStubData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
    })(resolver)
    expect("paymaster" in result).toBe(true)
  })

  it("parses a v0.6 stub response", async () => {
    const resolver: Http = vi.fn(async () =>
      success_response({
        paymasterAndData: "0xdeadbeef",
        isFinal: false,
      }),
    )
    const result = await pm_getPaymasterStubData({
      userOp: USER_OP,
      entryPoint: ENTRY_POINT,
      chainId: CHAIN_ID,
    })(resolver)
    expect("paymasterAndData" in result).toBe(true)
  })

  it("throws RpcRequestError preserving code + data on JSON-RPC error", async () => {
    const resolver: Http = vi.fn(async () =>
      error_response(-32001, "policy rejected", {
        reason: "limit",
      }),
    )
    await expect(
      pm_getPaymasterStubData({
        userOp: USER_OP,
        entryPoint: ENTRY_POINT,
        chainId: CHAIN_ID,
      })(resolver),
    ).rejects.toMatchObject({
      name: "RpcRequestError",
      code: -32001,
      data: { reason: "limit" },
    })
    await expect(
      pm_getPaymasterStubData({
        userOp: USER_OP,
        entryPoint: ENTRY_POINT,
        chainId: CHAIN_ID,
      })(resolver),
    ).rejects.toBeInstanceOf(RpcRequestError)
  })
})
