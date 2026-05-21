import { uintSchema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import { eip155_1 } from "../../../../chain/src"
import {
  create_reader,
  encode_chain_id,
  http,
} from "../../../../transport/src"

import { eth_blockNumber } from "./block-number"

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
describe.skip("eth_blockNumber", () => {
  it("should correctly get the latest mined block", async () => {
    const reader = create_reader([
      {
        chainId: "eip155:1",
        transports: SEPOLIA_RPC_URLS.map(http),
      },
    ])
    const readable = eth_blockNumber()
    const chainId = encode_chain_id({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const blockNumber_ = await readable(
      reader({ chain_id: chainId }),
    )
    expect(() =>
      parse(uintSchema, blockNumber_),
    ).not.toThrow()
  })
})
