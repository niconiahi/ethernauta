import { describe, expect, it } from "vitest"

import { createReader, encodeChainId, http } from "@ethernauta/transport"

import { getLatestBlockhash } from "./get-latest-blockhash"

describe("getLatestBlockhash", () => {
  it("should correctly get the latest blockhash at given commitment", async () => {
    const reader = createReader([
      {
        chainId: "solana:101",
        transports: [
          http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
        ],
      },
    ])
    const readable = getLatestBlockhash([{ commitment: "finalized" }])
    const chainId = encodeChainId({ namespace: "solana", reference: "101" })
    const latestBlockhash = await readable(reader(chainId))
    expect(latestBlockhash.value).toBeDefined()
  })

  it("should correctly get the latest blockhash if no arguments are provided", async () => {
    const reader = createReader([
      {
        chainId: "solana:101",
        transports: [
          http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
        ],
      },
    ])
    const readable = getLatestBlockhash()
    const chainId = encodeChainId({ namespace: "solana", reference: "101" })
    const latestBlockhash = await readable(reader(chainId))
    expect(latestBlockhash.value).toBeDefined()
  })
})
