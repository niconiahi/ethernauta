import { describe, expect, it } from "vitest"

import { createReader, encodeChainId, http } from "@ethernauta/transport"

import { getMinimumBalanceForRentExemption } from "./get-minimum-balance-for-rent-exemption"

describe("getMinimumBalanceForRentExemption", () => {
  it("should correctly get the minimum balance for usize 50", async () => {
    const reader = createReader([
      {
        chainId: "solana:101",
        transports: [
          http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
        ],
      },
    ])
    const readable = getMinimumBalanceForRentExemption([50, { commitment: "processed" }])
    const chainId = encodeChainId({ namespace: "solana", reference: "101" })
    const minimumBalanceForRentExemption = await readable(reader(chainId))
    expect(minimumBalanceForRentExemption).toBeGreaterThan(0)
  })
})
