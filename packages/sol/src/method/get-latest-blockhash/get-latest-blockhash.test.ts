import { describe } from "vitest"

import { createReader, http } from "@ethernauta/transport"

import { getLatestBlockhash } from "./get-latest-blockhash"

describe("getLatestBlockhash", () => {
  it("should correctly get the latest blockhash at given commitment", async () => {
    const reader = createReader([
      http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
    ])
    const readable = getLatestBlockhash([{ commitment: "finalized" }])
    const latestBlockhash = await readable(reader)
    expect(latestBlockhash.value).toBeDefined()
  })

  it("should correctly get the latest blockhash if no arguments are provided", async () => {
    const reader = createReader([
      http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
    ])
    const readable = getLatestBlockhash()
    const latestBlockhash = await readable(reader)
    expect(latestBlockhash.value).toBeDefined()
  })
})
