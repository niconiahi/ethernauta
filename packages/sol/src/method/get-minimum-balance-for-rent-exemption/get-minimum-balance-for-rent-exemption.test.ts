import { describe } from "vitest"

import { createReader, http } from "@ethernauta/transport"

import { getMinimumBalanceForRentExemption } from "./get-minimum-balance-for-rent-exemption"

describe("getMinimumBalanceForRentExemption", () => {
  it("should correctly get the minimum balance for usize 50", async () => {
    const reader = createReader([
      http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
    ])
    const readable = getMinimumBalanceForRentExemption([50, { commitment: "processed" }])
    const minimumBalanceForRentExemption = await readable(reader)
    expect(minimumBalanceForRentExemption).toBeGreaterThan(0)
  })
})
