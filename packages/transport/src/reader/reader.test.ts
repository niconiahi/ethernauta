import { describe } from "vitest"

import { eth_getBalance } from "../../../eth/src"
import { http } from "../http"

import { createReader_V2 } from "./reader"

describe("reader", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = createReader_V2([
      {
        chain: "eip155:1",
        transports: [
          http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
        ],
      },
    ])
    const readable = eth_getBalance(["0xF344B01DA08b142D2466dae9e47E333f22e64588", "earliest"])
    const mainnetReader = reader("eip155:1")
    const balance = await readable(mainnetReader)
    expect(balance).toBeDefined()
  })
})
