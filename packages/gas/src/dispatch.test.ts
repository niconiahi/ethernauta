import { eip155_1 } from "@ethernauta/chain"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { calculate_gas } from "./dispatch"
import { stub_http } from "./test-helpers"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

describe("calculate_gas", () => {
  it("routes a 1559-family chain to estimate_1559_fees", async () => {
    // Latest base fee = 0x64 = 100. Priority samples 4,4,4,4 → 4.
    // max_fee = 100 * 1.5 + 4 = 154 = 0x9a.
    const result_payload = {
      oldestBlock: "0x1",
      baseFeePerGas: [
        "0x32",
        "0x3c",
        "0x46",
        "0x50",
        "0x64",
      ],
      gasUsedRatio: [0.5, 0.5, 0.5, 0.5],
      reward: [["0x4"], ["0x4"], ["0x4"], ["0x4"]],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: CHAIN_ID },
    ]
    const fees = await calculate_gas(eip155_1, {
      base_fee_multiplier: 1.5,
      priority_percentile: 10,
    })(resolved)
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_priority_fee_per_gas).toBe("0x4")
    expect(fees.max_fee_per_gas).toBe("0x9a")
  })
})
