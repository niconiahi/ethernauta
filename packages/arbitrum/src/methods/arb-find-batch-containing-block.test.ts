import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { UintSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { arb_findBatchContainingBlock } from "./arb-find-batch-containing-block"

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
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const BLOCK = parse(UintSchema, "0x186a0")

describe("arb_findBatchContainingBlock", () => {
  it("emits the method with the block number and accepts a JSON-number result", async () => {
    const { transport, last_call } =
      stub_with_capture(12345)
    const resolved = testing_reader(transport)
    const batch = await arb_findBatchContainingBlock([
      BLOCK,
    ])(resolved)
    expect(last_call.value).toEqual([
      "arb_findBatchContainingBlock",
      [BLOCK],
    ])
    expect(batch).toBe("0x3039")
  })

  it("also accepts a hex-string result", async () => {
    const { transport } = stub_with_capture("0x3039")
    const resolved = testing_reader(transport)
    const batch = await arb_findBatchContainingBlock({
      blockNumber: BLOCK,
    })(resolved)
    expect(batch).toBe("0x3039")
  })

  it("throws when the upstream node hasn't included the block in any batch yet", async () => {
    const transport = async (
      _call: Call,
    ): Promise<Response> => ({
      id: "test",
      jsonrpc: "2.0" as const,
      error: {
        code: -32000,
        message: "block not in any batch",
      },
    })
    const resolved = testing_reader(transport)
    await expect(
      arb_findBatchContainingBlock([BLOCK])(resolved),
    ).rejects.toThrow("block not in any batch")
  })
})
