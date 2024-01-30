import { describe, expect, it } from "vitest"

import { createReader, encodeChainId, http } from "@ethernauta/transport"

import { sendTransaction } from "./send-transaction"

describe.skip("sendTransaction", () => {
  it("should correctly get the send a base64 encoded transaction", async () => {
    const reader = createReader([
      {
        chainId: "solana:101",
        transports: [
          http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
        ],
      },
    ])
    const transaction = "4hXTCkRzt9WyecNzV1XPgCDfGAZzQKNxLXgynz5QDuWWPSAZBZSHptvWRL3BjCvzUXRdKvHL2b7yGrRQcWyaqsaBCncVG7BFggS8w9snUts67BSh3EqKpXLUm5UMHfD7ZBe9GhARjbNQMLJ1QD3Spr6oMTBU6EhdB4RD8CP2xUxr2u3d6fos36PD98XS6oX8TQjLpsMwncs5DAMiD4nNnR8NBfyghGCWvCVifVwvA8B8TJxE1aiyiv2L429BCWfyzAme5sZW8rDb14NeCQHhZbtNqfXhcp2tAnaAT"
    const readable = sendTransaction({ transaction, configuration: { encoding: "base64" } })
    const chainId = encodeChainId({ namespace: "solana", reference: "101" })
    const latestBlockhash = await readable(reader(chainId))
    expect(latestBlockhash).toBeDefined()
  })
})
