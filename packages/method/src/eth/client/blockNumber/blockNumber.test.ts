import { describe, test, expect } from "vitest"
import { createReader, httpTransport } from "@ethernauta/transport"
import { blockNumber } from "./blockNumber"
import { uintToNumber } from "@ethernauta/core"

describe('eth_blockNumber', () => {
  test('should correctly get the blocks number =>', async () => {
    const reader = createReader([
      httpTransport('https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/')
    ])
    const blockNumber_ = uintToNumber(await blockNumber(reader))
    expect(blockNumber_).toBeTypeOf('number')
  })
})
