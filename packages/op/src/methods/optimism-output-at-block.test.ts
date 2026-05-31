import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { UintSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { optimism_outputAtBlock } from "./optimism-output-at-block"

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

// L2BlockRef / L1BlockRef / L1Origin all hex-marshal their
// numeric fields. Genesis would be decimal — not exercised
// by this RPC.
const sample_l1_block_ref = {
  hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
  number: "0x100",
  parentHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  timestamp: "0x65a0c0d0",
}
const sample_l2_block_ref = {
  hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
  number: "0x4d2",
  parentHash:
    "0x3333333333333333333333333333333333333333333333333333333333333333",
  timestamp: "0x65a0c0e0",
  l1origin: {
    hash: "0x4444444444444444444444444444444444444444444444444444444444444444",
    number: "0xff",
  },
  sequenceNumber: "0x3",
}

describe("optimism_outputAtBlock", () => {
  it("emits the method + positional block number and parses OutputResponse", async () => {
    const { transport, last_call } = stub_with_capture({
      version:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      outputRoot:
        "0xdeadbeef00000000000000000000000000000000000000000000000000000000",
      blockRef: sample_l2_block_ref,
      withdrawalStorageRoot:
        "0xaa00000000000000000000000000000000000000000000000000000000000000",
      stateRoot:
        "0xbb00000000000000000000000000000000000000000000000000000000000000",
      syncStatus: {
        current_l1: sample_l1_block_ref,
        current_l1_finalized: sample_l1_block_ref,
        head_l1: sample_l1_block_ref,
        safe_l1: sample_l1_block_ref,
        finalized_l1: sample_l1_block_ref,
        unsafe_l2: sample_l2_block_ref,
        safe_l2: sample_l2_block_ref,
        finalized_l2: sample_l2_block_ref,
      },
    })
    const block_number = parse(UintSchema, "0x4d2")
    const resolved = testing_reader(transport)
    const output = await optimism_outputAtBlock([
      block_number,
    ])(resolved)
    expect(last_call.value).toEqual([
      "optimism_outputAtBlock",
      ["0x4d2"],
    ])
    expect(output.outputRoot).toBe(
      "0xdeadbeef00000000000000000000000000000000000000000000000000000000",
    )
    expect(output.blockRef.number).toBe("0x4d2")
    expect(output.blockRef.l1origin.number).toBe("0xff")
    expect(
      output.syncStatus?.unsafe_l2.sequenceNumber,
    ).toBe("0x3")
  })

  it("accepts the object parameter form and normalizes to positional", async () => {
    const { transport, last_call } = stub_with_capture({
      version:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      outputRoot:
        "0x1100000000000000000000000000000000000000000000000000000000000000",
      blockRef: sample_l2_block_ref,
      withdrawalStorageRoot:
        "0xaa00000000000000000000000000000000000000000000000000000000000000",
      stateRoot:
        "0xbb00000000000000000000000000000000000000000000000000000000000000",
    })
    const block_number = parse(UintSchema, "0x1")
    const resolved = testing_reader(transport)
    await optimism_outputAtBlock({
      blockNumber: block_number,
    })(resolved)
    expect(last_call.value).toEqual([
      "optimism_outputAtBlock",
      ["0x1"],
    ])
  })
})
