import { safeParse } from "valibot"
import { describe, expect } from "vitest"

import { createReader, http } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"

import { blockNumber } from "./block-number"

describe("eth_blockNumber", () => {
  it("should correctly get the latest mined block", async () => {
    const reader = createReader([
      http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
    ])
    const readable = blockNumber()
    const blockNumber_ = await readable(reader)
    expect(blockNumber_).toSatisfy(value => safeParse(uintSchema, value).success)
  })
})
