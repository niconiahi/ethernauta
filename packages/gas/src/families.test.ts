import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { describe, expect, it } from "vitest"

import { gas_family } from "./families"

describe("gas_family", () => {
  it("routes Ethereum mainnet to 1559", () => {
    expect(gas_family(eip155_1)).toBe("1559")
  })

  it("routes Sepolia to 1559", () => {
    expect(gas_family(eip155_11155111)).toBe("1559")
  })

  it("routes Optimism to op-stack", () => {
    expect(gas_family(eip155_10)).toBe("op-stack")
  })
})
