import { describe } from "vitest"

import { eip155_1, eth_getBalance } from "../../../eth/src"
import { encodeChainId } from "../chain"
import { http } from "../http"

import { createReader_V2 } from "./reader"

describe("reader", () => {
  it("should correctly transact when submitting a valid transaction in a kwown chain", async () => {
    const reader = createReader_V2([
      {
        chain: "eip155:1",
        transports: [
          http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
        ],
      },
    ])
    const readable = eth_getBalance(["0xF344B01DA08b142D2466dae9e47E333f22e64588", "earliest"])
    const chainId = encodeChainId({ namespace: "eip155", reference: String(eip155_1.chainId) })
    const balance = await readable(reader(chainId))
    expect(balance).toBeDefined()
  })
})
