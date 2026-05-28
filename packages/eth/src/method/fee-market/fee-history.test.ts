import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { UintSchema } from "@ethernauta/core"
import type {
  Call,
  ResolvedReader,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { eth_feeHistory } from "./fee-history"

function stub_http(
  response_result: unknown,
): (_call: Call) => Promise<Response> {
  return async (_call: Call): Promise<Response> => ({
    id: "test",
    jsonrpc: "2.0",
    result: response_result,
  })
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})
const BLOCK_COUNT_1 = parse(UintSchema, "0x1")
const BLOCK_COUNT_4 = parse(UintSchema, "0x4")

describe("eth_feeHistory", () => {
  it("parses a realistic mainnet response shape (hex uint reward matrix)", async () => {
    const result_payload = {
      oldestBlock: "0x14a3fbc",
      baseFeePerGas: [
        "0x59682f00",
        "0x59682f01",
        "0x59682f02",
        "0x59682f03",
        "0x59682f04",
      ],
      gasUsedRatio: [0.5, 0.6, 0.55, 0.7, 0.65],
      reward: [
        ["0x3b9aca00", "0x77359400"],
        ["0x3b9aca00", "0x59682f00"],
        ["0x3b9aca00", "0x77359400"],
        ["0x3b9aca00", "0x77359400"],
      ],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: CHAIN_ID },
    ]
    const result = await eth_feeHistory({
      blockCount: BLOCK_COUNT_4,
      newestBlock: "latest",
      rewardPercentiles: [25, 75],
    })(resolved)
    expect(result.reward[0]?.[0]).toBe("0x3b9aca00")
    expect(result.baseFeePerGas).toHaveLength(5)
  })

  it("rejects the pre-fix shape where reward holds raw numbers", async () => {
    const result_payload = {
      oldestBlock: "0x14a3fbc",
      baseFeePerGas: ["0x59682f00"],
      gasUsedRatio: [0.5],
      reward: [[25, 75]],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: CHAIN_ID },
    ]
    await expect(
      eth_feeHistory({
        blockCount: BLOCK_COUNT_1,
        newestBlock: "latest",
        rewardPercentiles: [25, 75],
      })(resolved),
    ).rejects.toThrow()
  })

  it("accepts both tuple and named parameter shapes", async () => {
    const result_payload = {
      oldestBlock: "0x1",
      baseFeePerGas: ["0x1"],
      gasUsedRatio: [0],
      reward: [["0x1"]],
    }
    const resolved: ResolvedReader = [
      [stub_http(result_payload)],
      { chain_id: CHAIN_ID },
    ]
    await expect(
      eth_feeHistory([BLOCK_COUNT_1, "latest", [50]])(
        resolved,
      ),
    ).resolves.toBeDefined()
    await expect(
      eth_feeHistory({
        blockCount: BLOCK_COUNT_1,
        newestBlock: "latest",
        rewardPercentiles: [50],
      })(resolved),
    ).resolves.toBeDefined()
  })
})
