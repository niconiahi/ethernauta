import { describe, expect, it } from "vitest"

import { eip155_300_deploys } from "./eip155-300"
import { eip155_324_deploys } from "./eip155-324"

describe("eip155-324 — zkSync Era mainnet deploys", () => {
  it("settles to eip155:1", () => {
    expect(eip155_324_deploys.parentChainId).toBe(1)
  })

  it("uses ETH as the base token", () => {
    expect(eip155_324_deploys.l1.baseToken).toBe(
      "0x0000000000000000000000000000000000000001",
    )
  })

  // The mainnet Diamond Proxy is a constant address that has
  // shipped since v1 of the protocol — pinning catches accidental
  // drift in the pull-deploys discovery script (e.g. a swap to a
  // CTM-managed proxy on a different chain).
  it("pins the canonical mainnet Diamond Proxy", () => {
    expect(eip155_324_deploys.l1.diamondProxy).toBe(
      "0x32400084C286CF3E17e7B677ea9583e60a000324",
    )
  })

  it("flags mainnet as production", () => {
    expect(eip155_324_deploys.isTestnet).toBe(false)
  })
})

describe("eip155-300 — zkSync Era Sepolia deploys", () => {
  it("settles to eip155:11155111", () => {
    expect(eip155_300_deploys.parentChainId).toBe(11155111)
  })

  it("uses ETH as the base token", () => {
    expect(eip155_300_deploys.l1.baseToken).toBe(
      "0x0000000000000000000000000000000000000001",
    )
  })

  it("flags Sepolia as testnet", () => {
    expect(eip155_300_deploys.isTestnet).toBe(true)
  })
})
