import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { optimism_syncStatus } from "./optimism-sync-status"

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

const l1_ref = {
  hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
  number: "0xa",
  parentHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  timestamp: "0x65a0c0d0",
}
const l2_ref = {
  hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
  number: "0x14",
  parentHash:
    "0x3333333333333333333333333333333333333333333333333333333333333333",
  timestamp: "0x65a0c0e0",
  l1origin: {
    hash: "0x4444444444444444444444444444444444444444444444444444444444444444",
    number: "0x9",
  },
  sequenceNumber: "0x1",
}

describe("optimism_syncStatus", () => {
  it("emits the method with no params and parses pre-interop SyncStatus", async () => {
    const { transport, last_call } = stub_with_capture({
      current_l1: l1_ref,
      current_l1_finalized: l1_ref,
      head_l1: l1_ref,
      safe_l1: l1_ref,
      finalized_l1: l1_ref,
      unsafe_l2: l2_ref,
      safe_l2: l2_ref,
      finalized_l2: l2_ref,
    })
    const resolved = testing_reader(transport)
    const status = await optimism_syncStatus()(resolved)
    expect(last_call.value).toEqual(["optimism_syncStatus"])
    expect(status.unsafe_l2.number).toBe("0x14")
    expect(status.pending_safe_l2).toBeUndefined()
    expect(status.cross_unsafe_l2).toBeUndefined()
  })

  it("accepts interop-era fields when present", async () => {
    const { transport } = stub_with_capture({
      current_l1: l1_ref,
      current_l1_finalized: l1_ref,
      head_l1: l1_ref,
      safe_l1: l1_ref,
      finalized_l1: l1_ref,
      unsafe_l2: l2_ref,
      safe_l2: l2_ref,
      finalized_l2: l2_ref,
      pending_safe_l2: l2_ref,
      cross_unsafe_l2: l2_ref,
      local_safe_l2: l2_ref,
    })
    const resolved = testing_reader(transport)
    const status = await optimism_syncStatus()(resolved)
    expect(status.cross_unsafe_l2?.l1origin.hash).toBe(
      "0x4444444444444444444444444444444444444444444444444444444444444444",
    )
  })
})
