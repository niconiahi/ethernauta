import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { estimate_1559_fees } from "./estimate-1559-fees"

function stub_http<T>(
  response_result: T,
): (_call: Call) => Promise<Response> {
  return async (_call: Call) => ({
    id: "test",
    jsonrpc: "2.0" as const,
    result: response_result,
  })
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("estimate_1559_fees", () => {
  it("composes base × 1.5 + priority on a known fee history", async () => {
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
    const resolved = testing_reader(
      stub_http(result_payload),
    )
    const fees = await estimate_1559_fees({
      base_fee_multiplier: 1.5,
      priority_percentile: 10,
    })(resolved)
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_priority_fee_per_gas).toBe("0x4")
    expect(fees.max_fee_per_gas).toBe("0x9a")
  })

  it("composes base × 2.0 + priority on a known fee history", async () => {
    // Latest base fee = 0x3e8 = 1000. Priority samples 10,20,30,40 → 25 (= 0x19).
    // max_fee = 1000 * 2.0 + 25 = 2025 = 0x7e9.
    const result_payload = {
      oldestBlock: "0x1",
      baseFeePerGas: [
        "0x100",
        "0x200",
        "0x300",
        "0x350",
        "0x3e8",
      ],
      gasUsedRatio: [0.5, 0.5, 0.5, 0.5],
      reward: [["0xa"], ["0x14"], ["0x1e"], ["0x28"]],
    }
    const resolved = testing_reader(
      stub_http(result_payload),
    )
    const fees = await estimate_1559_fees({
      base_fee_multiplier: 2.0,
      priority_percentile: 50,
    })(resolved)
    expect(fees.base_fee_per_gas).toBe("0x3e8")
    expect(fees.max_priority_fee_per_gas).toBe("0x19")
    expect(fees.max_fee_per_gas).toBe("0x7e9")
  })
})
