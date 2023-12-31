import { describe, expect } from "vitest"

import { createReader, http } from "@ethernauta/transport"

import { getBlockByHash } from "./get-block-by-hash"

describe("eth_getBlockByHash", () => {
  it("should return block when valid hash is provided", async () => {
    const reader = createReader([
      http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
    ])
    const VALID_BLOCK_HASH = "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26"
    const readable = getBlockByHash([VALID_BLOCK_HASH, false])
    const block = await readable(reader)
    expect(block).toHaveProperty("hash", VALID_BLOCK_HASH)
  })

  it("should return null when invalid hash is provided", async () => {
    const reader = createReader([
      http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
    ])
    const INVALID_BLOCK_HASH = "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e36"
    const readable = getBlockByHash([INVALID_BLOCK_HASH, false])
    const block = await readable(reader)
    expect(block).toBeNull()
  })

  it("should accept arguments as an object and return block when valid hash is provided", async () => {
    const reader = createReader([
      http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
    ])
    const VALID_BLOCK_HASH = "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26"
    const readable = getBlockByHash({ blockHash: VALID_BLOCK_HASH, hydratedTransactions: false })
    const block = await readable(reader)
    expect(block).toHaveProperty("hash", VALID_BLOCK_HASH)
  })
})
