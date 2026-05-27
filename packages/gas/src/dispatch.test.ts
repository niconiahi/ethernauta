import {
  eip155_1,
  eip155_324,
  eip155_8453,
  eip155_42161,
} from "@ethernauta/chain"
import { addressSchema } from "@ethernauta/core"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { calculate_gas } from "./dispatch"
import { stub_http, stub_http_by_method } from "./test-helpers"

function chain_id_for(
  _reference: string | number,
): ReturnType<typeof encode_chain_id> {
  return encode_chain_id({
    namespace: "eip155",
    reference: _reference,
  })
}

describe("calculate_gas", () => {
  it("routes a 1559-family chain to estimate_1559_fees", async () => {
    const result_payload = {
      oldestBlock: "0x1",
      baseFeePerGas: ["0x32", "0x3c", "0x46", "0x50", "0x64"],
      gasUsedRatio: [0.5, 0.5, 0.5, 0.5],
      reward: [["0x4"], ["0x4"], ["0x4"], ["0x4"]],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: chain_id_for(eip155_1.chainId) },
    ]
    const fees = await calculate_gas(eip155_1, {
      kind: "1559",
      base_fee_multiplier: 1.5,
      priority_percentile: 10,
    })(resolved)
    expect(fees.kind).toBe("1559")
    if (fees.kind !== "1559") return
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_fee_per_gas).toBe("0x9a")
  })

  it("routes Base to the op-stack helper", async () => {
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
      { chain_id: chain_id_for(eip155_8453.chainId) },
    ]
    const fees = await calculate_gas(eip155_8453, {
      kind: "op-stack",
      tx: {
        to: parse(
          addressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      },
      base_fee_multiplier: 1.5,
      priority_percentile: 10,
    })(resolved)
    expect(fees.kind).toBe("op-stack")
    if (fees.kind !== "op-stack") return
    expect(fees.l1_fee).toBe("0x12c")
  })

  it("routes Arbitrum One to the arbitrum helper", async () => {
    function slot(_value: bigint): string {
      return _value.toString(16).padStart(64, "0")
    }
    const result = `0x${slot(21000n)}${slot(300n)}${slot(100_000_000n)}${slot(1_000_000_000n)}`
    const resolved: ResolvedReader = [
      [stub_http(result)],
      { chain_id: chain_id_for(eip155_42161.chainId) },
    ]
    const fees = await calculate_gas(eip155_42161, {
      kind: "arbitrum",
      tx: {
        to: parse(
          addressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      },
    })(resolved)
    expect(fees.kind).toBe("arbitrum")
    if (fees.kind !== "arbitrum") return
    expect(fees.gas_estimate).toBe("0x5208")
  })

  it("routes zkSync Era to the zksync helper", async () => {
    const result_payload = {
      gas_limit: "0x22f28",
      gas_per_pubdata_limit: "0x16",
      max_fee_per_gas: "0x2b275d0",
      max_priority_fee_per_gas: "0x0",
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: chain_id_for(eip155_324.chainId) },
    ]
    const fees = await calculate_gas(eip155_324, {
      kind: "zksync",
      tx: {
        to: parse(
          addressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      },
    })(resolved)
    expect(fees.kind).toBe("zksync")
    if (fees.kind !== "zksync") return
    expect(fees.gas_limit).toBe("0x22f28")
  })

  it("throws when the kind does not match the chain's family", () => {
    // Mainnet is 1559; an op-stack-shaped payload should reject.
    expect(() =>
      calculate_gas(eip155_1, {
        kind: "op-stack",
        tx: {
          to: parse(
            addressSchema,
            "0x0000000000000000000000000000000000000001",
          ),
        },
        base_fee_multiplier: 1.5,
        priority_percentile: 10,
      }),
    ).toThrow(/1559 family requires/)
  })
})
