import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type { Call } from "@ethernauta/transport"
import type { Response } from "@ethernauta/transport"
import { RpcRequestError } from "@ethernauta/transport"
import { invariant } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  eth_call,
  StateOverrideEntrySchema,
} from "./call"

const TO = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)
const HOLDER = parse(
  AddressSchema,
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
)
const CALLDATA = parse(BytesSchema, "0xdeadbeef")
const SLOT = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)
const VALUE_BYTES32 = parse(
  Bytes32Schema,
  `0x${"f".repeat(64)}`,
)
const BALANCE = parse(UintSchema, "0x1")

function make_capturing_transport(): {
  transport: (_call: Call) => Promise<Response>
  calls: Call[]
} {
  const calls: Call[] = []
  return {
    transport: async (call: Call): Promise<Response> => {
      calls.push(call)
      return {
        id: "1",
        jsonrpc: "2.0",
        result: "0x",
      }
    },
    calls,
  }
}

describe("StateOverrideEntrySchema", () => {
  it("accepts balance, nonce, code alone", () => {
    expect(() =>
      parse(StateOverrideEntrySchema, {
        balance: BALANCE,
      }),
    ).not.toThrow()
  })

  it("accepts state alone", () => {
    expect(() =>
      parse(StateOverrideEntrySchema, {
        state: { [SLOT]: VALUE_BYTES32 },
      }),
    ).not.toThrow()
  })

  it("accepts stateDiff alone", () => {
    expect(() =>
      parse(StateOverrideEntrySchema, {
        stateDiff: { [SLOT]: VALUE_BYTES32 },
      }),
    ).not.toThrow()
  })

  it("rejects state and stateDiff together", () => {
    expect(() =>
      parse(StateOverrideEntrySchema, {
        state: { [SLOT]: VALUE_BYTES32 },
        stateDiff: { [SLOT]: VALUE_BYTES32 },
      }),
    ).toThrow()
  })
})

describe("eth_call wire shape", () => {
  it("omits trailing nulls when no override given (tuple, no block)", async () => {
    const { transport, calls } = make_capturing_transport()
    await eth_call([{ to: TO, input: CALLDATA }])([
      [transport],
      { chain_id: "eip155:1" },
    ])
    expect(calls).toHaveLength(1)
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [method, params] = call0
    expect(method).toBe("eth_call")
    expect(params).toEqual([{ to: TO, input: CALLDATA }])
  })

  it("preserves block tag when override absent", async () => {
    const { transport, calls } = make_capturing_transport()
    await eth_call([
      { to: TO, input: CALLDATA },
      "finalized",
    ])([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([
      { to: TO, input: CALLDATA },
      "finalized",
    ])
  })

  it("appends override as third positional, defaulting block to latest", async () => {
    const { transport, calls } = make_capturing_transport()
    await eth_call(
      [{ to: TO, input: CALLDATA }],
      { [HOLDER]: { balance: BALANCE } },
    )([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([
      { to: TO, input: CALLDATA },
      "latest",
      { [HOLDER]: { balance: BALANCE } },
    ])
  })

  it("uses caller-provided block tag alongside override", async () => {
    const { transport, calls } = make_capturing_transport()
    await eth_call(
      [{ to: TO, input: CALLDATA }, "safe"],
      { [HOLDER]: { balance: BALANCE } },
    )([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([
      { to: TO, input: CALLDATA },
      "safe",
      { [HOLDER]: { balance: BALANCE } },
    ])
  })

  it("accepts object-form parameters with override", async () => {
    const { transport, calls } = make_capturing_transport()
    await eth_call(
      {
        transaction: { to: TO, input: CALLDATA },
        blockNumberOrTagOrHash: "latest",
      },
      { [HOLDER]: { code: parse(BytesSchema, "0x6001") } },
    )([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([
      { to: TO, input: CALLDATA },
      "latest",
      { [HOLDER]: { code: "0x6001" } },
    ])
  })

  it("throws RpcRequestError carrying error.data on RPC failure", async () => {
    const error_transport = async (
      _call: Call,
    ): Promise<Response> => ({
      id: "1",
      jsonrpc: "2.0",
      error: {
        code: 3,
        message: "execution reverted",
        data: "0x556f1830",
      },
    })
    const promise = eth_call([{ to: TO, input: CALLDATA }])([
      [error_transport],
      { chain_id: "eip155:1" },
    ])
    const error = await promise.catch((e) => e)
    expect(error).toBeInstanceOf(RpcRequestError)
    if (error instanceof RpcRequestError) {
      expect(error.message).toBe("execution reverted")
      expect(error.code).toBe(3)
      expect(error.data).toBe("0x556f1830")
    }
  })
})
