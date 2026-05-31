import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { create_testing_writer } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { auctioneer_submitAuctionResolutionTransaction } from "./auctioneer-submit-auction-resolution-transaction"

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

const TX = {
  to: parse(
    AddressSchema,
    "0x0000000000000000000000000000000000000001",
  ),
  value: parse(UintSchema, "0x0"),
  input: parse(BytesSchema, "0xdeadbeef"),
  nonce: parse(UintSchema, "0x1"),
}

describe("auctioneer_submitAuctionResolutionTransaction", () => {
  it("emits the method with the transaction parameter and returns null on success", async () => {
    const { transport, last_call } = stub_with_capture(null)
    const resolved = testing_writer(transport)
    const result =
      await auctioneer_submitAuctionResolutionTransaction([
        TX,
      ])(resolved)
    expect(last_call.value).toEqual([
      "auctioneer_submitAuctionResolutionTransaction",
      [TX],
    ])
    expect(result).toBeNull()
  })

  it("normalizes the named-object parameter shape identically to the tuple shape", async () => {
    const { transport, last_call } = stub_with_capture(null)
    const resolved = testing_writer(transport)
    await auctioneer_submitAuctionResolutionTransaction({
      transaction: TX,
    })(resolved)
    expect(last_call.value).toEqual([
      "auctioneer_submitAuctionResolutionTransaction",
      [TX],
    ])
  })

  it("throws when the dispatcher returns an error", async () => {
    const transport = async (
      _call: Call,
    ): Promise<Response> => ({
      id: "test",
      jsonrpc: "2.0" as const,
      error: { code: -32000, message: "invalid signature" },
    })
    const resolved = testing_writer(transport)
    await expect(
      auctioneer_submitAuctionResolutionTransaction([TX])(
        resolved,
      ),
    ).rejects.toThrow("invalid signature")
  })
})
