import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import {
  AddressSchema,
  BytesSchema,
  Uint64Schema,
  UintSchema,
} from "@ethernauta/core"
import { create_testing_writer } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { timeboost_sendExpressLaneTransaction } from "./timeboost-send-express-lane-transaction"

function stub_with_capture<T>(response_result: T): {
  transport: (_call: Call) => Promise<Response>
  last_call: { value: Call | null }
} {
  const last_call: { value: Call | null } = { value: null }
  const transport = async (
    _call: Call,
  ): Promise<Response> => {
    last_call.value = _call
    return {
      id: "test",
      jsonrpc: "2.0" as const,
      result: response_result,
    }
  }
  return { transport, last_call }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_42161.chainId,
})
const testing_writer = create_testing_writer({
  chain_id: CHAIN_ID,
})

const SUBMISSION = {
  chainId: parse(UintSchema, "0xa4b1"),
  round: parse(Uint64Schema, "0x2a"),
  auctionContractAddress: parse(
    AddressSchema,
    "0x0000000000000000000000000000000000000001",
  ),
  transaction: parse(BytesSchema, "0xdead"),
  options: null,
  sequenceNumber: parse(Uint64Schema, "0x0"),
  signature: parse(BytesSchema, "0xbeef"),
}

describe("timeboost_sendExpressLaneTransaction", () => {
  it("emits the method with the submission parameter and returns null on success", async () => {
    const { transport, last_call } = stub_with_capture(null)
    const resolved = testing_writer(transport)
    const result =
      await timeboost_sendExpressLaneTransaction([
        SUBMISSION,
      ])(resolved)
    expect(last_call.value).toEqual([
      "timeboost_sendExpressLaneTransaction",
      [SUBMISSION],
    ])
    expect(result).toBeNull()
  })

  it("normalizes the named-object parameter shape identically to the tuple shape", async () => {
    const { transport, last_call } = stub_with_capture(null)
    const resolved = testing_writer(transport)
    await timeboost_sendExpressLaneTransaction({
      submission: SUBMISSION,
    })(resolved)
    expect(last_call.value).toEqual([
      "timeboost_sendExpressLaneTransaction",
      [SUBMISSION],
    ])
  })

  it("throws when the dispatcher returns an error", async () => {
    const transport = async (
      _call: Call,
    ): Promise<Response> => ({
      id: "test",
      jsonrpc: "2.0" as const,
      error: {
        code: -32000,
        message: "not in express lane",
      },
    })
    const resolved = testing_writer(transport)
    await expect(
      timeboost_sendExpressLaneTransaction([SUBMISSION])(
        resolved,
      ),
    ).rejects.toThrow("not in express lane")
  })
})
