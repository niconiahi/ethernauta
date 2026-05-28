import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { AddressSchema } from "@ethernauta/core"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { stub_http } from "../../test-helpers"

import { calculate_gas_arbitrum } from "./calculate-gas-arbitrum"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_42161.chainId,
})

// 32-byte big-endian hex slot for a decimal value.
function slot(_value: bigint): string {
  return _value.toString(16).padStart(64, "0")
}

describe("calculate_gas_arbitrum", () => {
  it("maps gasEstimateComponents 4-tuple into the arbitrum fees shape", async () => {
    // gasEstimate = 21000, gasEstimateForL1 = 300, baseFee = 100_000_000,
    // l1BaseFeeEstimate = 1_000_000_000. The codec encodes the 4-tuple
    // as four 32-byte slots back-to-back; total 256 hex chars.
    const result = `0x${slot(21000n)}${slot(300n)}${slot(100_000_000n)}${slot(1_000_000_000n)}`
    const resolved: ResolvedReader = [
      [stub_http(result)],
      { chain_id: CHAIN_ID },
    ]
    const fees = await calculate_gas_arbitrum({
      tx: {
        to: parse(
          AddressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      },
    })(resolved)
    expect(fees.kind).toBe("arbitrum")
    expect(fees.gas_estimate).toBe("0x5208")
    expect(fees.l2_base_fee).toBe("0x5f5e100")
    expect(fees.l1_base_fee_estimate).toBe("0x3b9aca00")
  })
})
