import { describe } from "vitest"

import { createReader, http } from "@ethernauta/transport"

import { getBalance } from "./get-balance"

describe("eth_getBalance", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = createReader([
      http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
    ])
    const readable = getBalance(["5U3bH5b6XtG99aVWLqwVzYPVpQiFHytBD68Rz2eFPZd7"])
    const balance = await readable(reader)
    expect(balance.value).toBeDefined()
  })
})
