import { eip155_8453 } from "@ethernauta/chain"
import {
  addressSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { stub_http_by_method } from "../../test-helpers"

import { calculate_gas_op_stack } from "./calculate-gas-op-stack"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})

describe("calculate_gas_op_stack", () => {
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
    const resolved: ResolvedReader = [
      [transport],
      { chain_id: CHAIN_ID },
    ]
    const fees = await calculate_gas_op_stack({
      tx: {
        to: parse(
          addressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, "0x"),
      },
      base_fee_multiplier: 1.5,
      priority_percentile: 10,
    })(resolved)
    expect(fees.kind).toBe("op-stack")
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_priority_fee_per_gas).toBe("0x4")
    expect(fees.max_fee_per_gas).toBe("0x9a")
    expect(fees.l1_fee).toBe("0x12c")
  })
})
