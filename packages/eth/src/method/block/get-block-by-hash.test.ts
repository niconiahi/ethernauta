import { eip155_1 } from "@ethernauta/chain"

import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { describe, expect, it } from "vitest"
import { eth_getBlockByHash } from "./get-block-by-hash"

// Promise.any inside the reader resolves on the first
// transport that succeeds — listing several public RPCs
// keeps the test green when any single endpoint flakes.
const SEPOLIA_RPC_URLS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://sepolia.gateway.tenderly.co",
  "https://rpc.sepolia.org",
  "https://1rpc.io/sepolia",
]

// TODO: connect integration test
describe.skip("eth_getBlockByHash", () => {
  it("should return block when valid hash is provided", async () => {
    const reader = create_reader([
      {
        chainId: "eip155:1",
        transports: SEPOLIA_RPC_URLS.map(http),
      },
    ])
    const VALID_BLOCK_HASH =
      "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26"
    const readable = eth_getBlockByHash([
      VALID_BLOCK_HASH,
      false,
    ])
    const chainId = encode_chain_id({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const block = await readable(
      reader({ chain_id: chainId }),
    )
    expect(block).toHaveProperty("hash", VALID_BLOCK_HASH)
  })

  it("should return null when invalid hash is provided", async () => {
    const reader = create_reader([
      {
        chainId: "eip155:1",
        transports: SEPOLIA_RPC_URLS.map(http),
      },
    ])
    const INVALID_BLOCK_HASH =
      "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e36"
    const readable = eth_getBlockByHash([
      INVALID_BLOCK_HASH,
      false,
    ])
    const chainId = encode_chain_id({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const block = await readable(
      reader({ chain_id: chainId }),
    )
    expect(block).toBeNull()
  })

  it("should accept arguments as an object and return block when valid hash is provided", async () => {
    const reader = create_reader([
      {
        chainId: "eip155:1",
        transports: SEPOLIA_RPC_URLS.map(http),
      },
    ])
    const VALID_BLOCK_HASH =
      "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26"
    const readable = eth_getBlockByHash({
      blockHash: VALID_BLOCK_HASH,
      hydratedTransactions: false,
    })
    const chainId = encode_chain_id({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const block = await readable(
      reader({ chain_id: chainId }),
    )
    expect(block).toHaveProperty("hash", VALID_BLOCK_HASH)
  })
})
