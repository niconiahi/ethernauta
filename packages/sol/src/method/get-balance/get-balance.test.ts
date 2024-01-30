import { describe, expect, it } from "vitest"

import { createReader, encodeChainId, http } from "@ethernauta/transport"

import { getBalance } from "./get-balance"

describe("getBalance", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = createReader([
      {
        chainId: "solana:101",
        transports: [
          http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
        ],
      },
    ])
    const readable = getBalance(["5U3bH5b6XtG99aVWLqwVzYPVpQiFHytBD68Rz2eFPZd7"])
    const chainId = encodeChainId({ namespace: "solana", reference: "101" })
    const balance = await readable(reader(chainId))
    expect(balance.value).toBeDefined()
  })
})
