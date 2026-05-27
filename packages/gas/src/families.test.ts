import {
  eip155_1,
  eip155_10,
  eip155_11155111,
} from "@ethernauta/chain"
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
