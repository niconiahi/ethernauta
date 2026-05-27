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

  it("routes Optimism to 1559 in v1 (OP_STACK set is empty)", () => {
    // v2 uncomments chainId 10 in OP_STACK; this assertion
    // documents the v1 behaviour and will flip to "op-stack"
    // at that point.
    expect(gas_family(eip155_10)).toBe("1559")
  })
})
