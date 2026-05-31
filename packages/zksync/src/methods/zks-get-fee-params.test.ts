import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { zks_getFeeParams } from "./zks-get-fee-params"

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
  reference: eip155_324.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

// Externally-tagged enum on the wire — `{ "V2": { ... } }`. Captured
// from a mainnet mainnet-era node response (numeric values redacted).
const V2_PAYLOAD = {
  V2: {
    config: {
      minimal_l2_gas_price: "0xee6b280",
      compute_overhead_part: "0",
      pubdata_overhead_part: "1",
      batch_overhead_l1_gas: "0xc3500",
      max_gas_per_batch: "0x1e8480",
      max_pubdata_per_batch: "0x18004",
    },
    l1_gas_price: "0x2540be400",
    l1_pubdata_price: "0x174876e800",
    conversion_ratio: {
      l1: { numerator: "0x1", denominator: "0x1" },
      sl: null,
      numerator: "0x1",
      denominator: "0x1",
    },
  },
}

describe("zks_getFeeParams", () => {
  it("decodes the V2 externally-tagged variant", async () => {
    const resolved = testing_reader(stub_http(V2_PAYLOAD))
    const params = await zks_getFeeParams()(resolved)
    expect("V2" in params).toBe(true)
    if ("V2" in params) {
      expect(params.V2.config.minimal_l2_gas_price).toBe(
        "0xee6b280",
      )
      expect(params.V2.l1_gas_price).toBe("0x2540be400")
      expect(params.V2.conversion_ratio.l1).toEqual({
        numerator: "0x1",
        denominator: "0x1",
      })
      expect(params.V2.conversion_ratio.sl).toBeNull()
    }
  })
})
