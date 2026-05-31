import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { AddressSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { estimate_zksync_fees } from "./estimate-zksync-fees"

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

describe("estimate_zksync_fees", () => {
  it("returns the four-field zks_estimateFee response", async () => {
    const result_payload = {
      gas_limit: "0x22f28",
      gas_per_pubdata_limit: "0x16",
      max_fee_per_gas: "0x2b275d0",
      max_priority_fee_per_gas: "0x0",
    }
    const resolved = testing_reader(
      stub_http(result_payload),
    )
    const fees = await estimate_zksync_fees({
      tx: {
        to: parse(
          AddressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      },
    })(resolved)
    expect(fees.gas_limit).toBe("0x22f28")
    expect(fees.gas_per_pubdata_limit).toBe("0x16")
    expect(fees.max_fee_per_gas).toBe("0x2b275d0")
    expect(fees.max_priority_fee_per_gas).toBe("0x0")
  })
})
