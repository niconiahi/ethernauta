import { safeParse } from "valibot"
import { describe, expect } from "vitest"

import { createReader, encodeChainId, http } from "@ethernauta/transport"

import { eip155_1 } from "../../../chain"
import { uintSchema } from "../../../core"

import { eth_blockNumber } from "./block-number"

describe("eth_blockNumber", () => {
  it("should correctly get the latest mined block", async () => {
    const reader = createReader([
      {
        chainId: "eip155:1",
        transports: [
          http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
        ],
      },
    ])
    const readable = eth_blockNumber()
    const chainId = encodeChainId({ namespace: "eip155", reference: eip155_1.chainId })
    const blockNumber_ = await readable(reader(chainId))
    expect(blockNumber_).toSatisfy(value => safeParse(uintSchema, value).success)
  })
})
