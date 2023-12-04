import { describe, test, expect } from "vitest"
import { createReader, httpTransport } from "@ethernauta/transport"
import { uintSchema } from "@ethernauta/core"
import { blockNumber } from "./block-number"
import { safeParse } from "valibot"

describe('eth_blockNumber', () => {
  test('should correctly get the latest mined block', async () => {
    const reader = createReader([
      httpTransport('https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/')
    ])
    const call = blockNumber()
    const blockNumber_ = await call(reader)
    expect(blockNumber_).toSatisfy((value) => safeParse(uintSchema, value).success)
  })
})
