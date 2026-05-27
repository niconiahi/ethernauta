import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { uintSchema } from "@ethernauta/core"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { estimate_priority_fee } from "./estimate-priority-fee"
import { stub_http } from "./test-helpers"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})
const BLOCK_COUNT_4 = parse(uintSchema, "0x4")

describe("estimate_priority_fee", () => {
  it("averages a uniform reward column", async () => {
    const result_payload = {
      oldestBlock: "0x1",
      baseFeePerGas: ["0x1", "0x1", "0x1", "0x1", "0x1"],
      gasUsedRatio: [0.5, 0.5, 0.5, 0.5],
      reward: [
        ["0x3b9aca00"],
        ["0x3b9aca00"],
        ["0x3b9aca00"],
        ["0x3b9aca00"],
      ],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: CHAIN_ID },
    ]
    const priority = await estimate_priority_fee({
      block_count: BLOCK_COUNT_4,
      percentile: 10,
    })(resolved)
    expect(priority).toBe("0x3b9aca00")
  })

  it("averages a skewed reward column", async () => {
    // Rewards: 1, 3, 5, 7 → sum 16 → average 4 (= 0x4)
    const result_payload = {
      oldestBlock: "0x1",
      baseFeePerGas: ["0x1", "0x1", "0x1", "0x1", "0x1"],
      gasUsedRatio: [0.5, 0.5, 0.5, 0.5],
      reward: [["0x1"], ["0x3"], ["0x5"], ["0x7"]],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: CHAIN_ID },
    ]
    const priority = await estimate_priority_fee({
      block_count: BLOCK_COUNT_4,
      percentile: 50,
    })(resolved)
    expect(priority).toBe("0x4")
  })
})
