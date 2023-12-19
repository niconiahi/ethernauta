import { describe, expect } from "vitest"

import { eip155_11155111 } from "@ethernauta/chain"
import { bigToUint } from "@ethernauta/core"
import { getBalance } from "@ethernauta/method"
import { http } from "@ethernauta/transport"

import { createReader_V2 } from "./reader"

describe("reader", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = createReader_V2([
      {
        chain: eip155_11155111,
        transports: [
          http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
        ],
      },
    ])
    const readable = getBalance(["0xF344B01DA08b142D2466dae9e47E333f22e64588", "earliest"])
    const balance = await readable(reader(eip155_11155111))
    expect(balance).toBe(bigToUint(BigInt(0)))
  })
})
