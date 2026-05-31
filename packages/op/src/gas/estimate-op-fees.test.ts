import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { estimate_op_fees } from "./estimate-op-fees"

function stub_http_by_method<T>(
  results: Record<string, T>,
): (_call: Call) => Promise<Response> {
  return async (_call: Call) => {
    const method = _call[0]
    if (!(method in results)) {
      throw new Error(
        `stub_http_by_method: no fixture for "${method}"`,
      )
    }
    return {
      id: "test",
      jsonrpc: "2.0" as const,
      result: results[method],
    }
  }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("estimate_op_fees", () => {
  it("composes feeHistory + nonce + estimateGas + getL1Fee on Base", async () => {
    // L2 base fee = 0x64 = 100, priority = 0x4 = 4 → max_fee at 1.5x = 154 = 0x9a.
    // Nonce = 0x7. Gas limit = 0x5208 = 21000.
    // L1 fee = 32-byte big-endian, value = 0x12c = 300 wei.
    const l1_fee_padded = `0x${"00".repeat(30)}012c`
    const transport = stub_http_by_method({
      eth_feeHistory: {
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
      },
      eth_getTransactionCount: "0x7",
      eth_estimateGas: "0x5208",
      eth_call: l1_fee_padded,
    })
    const resolved = testing_reader(transport)
    const fees = await estimate_op_fees({
      tx: {
        to: parse(
          AddressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, "0x"),
      },
      base_fee_multiplier: 1.5,
      priority_percentile: 10,
    })(resolved)
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_priority_fee_per_gas).toBe("0x4")
    expect(fees.max_fee_per_gas).toBe("0x9a")
    expect(fees.l1_fee).toBe("0x12c")
  })
})
