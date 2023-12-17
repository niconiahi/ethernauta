import { describe, expect } from "vitest"
import { createReader, http } from "@ethernauta/transport"
import { bigToUint } from "@ethernauta/core"
import { getBalance } from "./get-balance"

describe("eth_getBalance", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = createReader([
      http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"),
    ])
    const readable = getBalance(["0xF344B01DA08b142D2466dae9e47E333f22e64588", "earliest"])
    const balance = await readable(reader)
    expect(balance).toBe(bigToUint(BigInt(0)))
  })
})
