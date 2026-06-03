import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { UintSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { optimism_safeHeadAtL1Block } from "./optimism-safe-head-at-l1-block"

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
      jsonrpc: "2.0",
      result: response_result,
    }
  }
  return { transport, last_call }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_10.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const sample_l1_block_id = {
  hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
  number: "0x100",
}
const sample_safe_head_id = {
  hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
  number: "0x4d2",
}

describe("optimism_safeHeadAtL1Block", () => {
  it("emits the method + positional l1 block number and parses SafeHeadAtL1Block", async () => {
    const { transport, last_call } = stub_with_capture({
      l1Block: sample_l1_block_id,
      safeHead: sample_safe_head_id,
    })
    const l1_block_number = parse(UintSchema, "0x100")
    const resolved = testing_reader(transport)
    const result = await optimism_safeHeadAtL1Block([
      l1_block_number,
    ])(resolved)
    expect(last_call.value).toEqual([
      "optimism_safeHeadAtL1Block",
      ["0x100"],
    ])
    expect(result.l1Block.number).toBe("0x100")
    expect(result.safeHead.hash).toBe(
      "0x2222222222222222222222222222222222222222222222222222222222222222",
    )
  })

  it("accepts the object parameter form and normalizes to positional", async () => {
    const { transport, last_call } = stub_with_capture({
      l1Block: sample_l1_block_id,
      safeHead: sample_safe_head_id,
    })
    const l1_block_number = parse(UintSchema, "0x1")
    const resolved = testing_reader(transport)
    await optimism_safeHeadAtL1Block({
      l1BlockNumber: l1_block_number,
    })(resolved)
    expect(last_call.value).toEqual([
      "optimism_safeHeadAtL1Block",
      ["0x1"],
    ])
  })
})
