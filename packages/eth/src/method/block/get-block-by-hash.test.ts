import { describe, expect, it } from "vitest"

import {
  createReader,
  encodeChainId,
  http,
} from "@ethernauta/transport"
import { eip155_1 } from "@ethernauta/chain"
import { eth_getBlockByHash } from "./get-block-by-hash"
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"

describe("eth_getBlockByHash", () => {
  it("should return block when valid hash is provided", async () => {
    const reader = createReader([
      {
        chainId: "eip155:1",
        transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
      },
    ])
    const VALID_BLOCK_HASH =
      "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26"
    const readable = eth_getBlockByHash([
      VALID_BLOCK_HASH,
      false,
    ])
    const chainId = encodeChainId({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const block = await readable(reader(chainId))
    expect(block).toHaveProperty("hash", VALID_BLOCK_HASH)
  })

  it("should return null when invalid hash is provided", async () => {
    const reader = createReader([
      {
        chainId: "eip155:1",
        transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
      },
    ])
    const INVALID_BLOCK_HASH =
      "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e36"
    const readable = eth_getBlockByHash([
      INVALID_BLOCK_HASH,
      false,
    ])
    const chainId = encodeChainId({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const block = await readable(reader(chainId))
    expect(block).toBeNull()
  })

  it("should accept arguments as an object and return block when valid hash is provided", async () => {
    const reader = createReader([
      {
        chainId: "eip155:1",
        transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
      },
    ])
    const VALID_BLOCK_HASH =
      "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26"
    const readable = eth_getBlockByHash({
      blockHash: VALID_BLOCK_HASH,
      hydratedTransactions: false,
    })
    const chainId = encodeChainId({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const block = await readable(reader(chainId))
    expect(block).toHaveProperty("hash", VALID_BLOCK_HASH)
  })
})
