import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { eip155_1729 } from "@ethernauta/chain/eip155-1729"
import { eip155_1996 } from "@ethernauta/chain/eip155-1996"
import { eip155_2187 } from "@ethernauta/chain/eip155-2187"
import { eip155_2911 } from "@ethernauta/chain/eip155-2911"
import { eip155_7887 } from "@ethernauta/chain/eip155-7887"
import { eip155_33139 } from "@ethernauta/chain/eip155-33139"
import { eip155_41455 } from "@ethernauta/chain/eip155-41455"
import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { eip155_42170 } from "@ethernauta/chain/eip155-42170"
import { eip155_70700 } from "@ethernauta/chain/eip155-70700"
import { eip155_98865 } from "@ethernauta/chain/eip155-98865"
import { eip155_111188 } from "@ethernauta/chain/eip155-111188"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { eip155_660279 } from "@ethernauta/chain/eip155-660279"
import { eip155_10241024 } from "@ethernauta/chain/eip155-10241024"
import { eip155_21000000 } from "@ethernauta/chain/eip155-21000000"
import { eip155_666666666 } from "@ethernauta/chain/eip155-666666666"
import { eip155_1380012617 } from "@ethernauta/chain/eip155-1380012617"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { require_deploy_addresses } from "./deploy"

function id_of(chain: { chainId: number }) {
  return encode_chain_id({
    namespace: "eip155",
    reference: chain.chainId,
  })
}

describe("require_deploy_addresses", () => {
  it.each([
    eip155_42161,
    eip155_42170,
    eip155_421614,
    eip155_660279,
    eip155_33139,
    eip155_1996,
    eip155_70700,
    eip155_1380012617,
    eip155_1729,
    eip155_98865,
    eip155_666666666,
    eip155_2187,
    eip155_2911,
    eip155_10241024,
    eip155_7887,
    eip155_41455,
    eip155_111188,
    eip155_21000000,
  ])("round-trips a payload for $name", (chain) => {
    const deploys = require_deploy_addresses(id_of(chain))
    expect(deploys.name).toBeTypeOf("string")
    expect(deploys.parentChainId).toBeTypeOf("number")
    expect(deploys.confirmPeriodBlocks).toBeTypeOf("number")
    expect(deploys.isTestnet).toBeTypeOf("boolean")
    expect(deploys.ethBridge.bridge).toMatch(
      /^0x[0-9a-fA-F]{40}$/,
    )
    expect(deploys.ethBridge.sequencerInbox).toMatch(
      /^0x[0-9a-fA-F]{40}$/,
    )
    expect(deploys.ethBridge.outbox).toMatch(
      /^0x[0-9a-fA-F]{40}$/,
    )
    expect(deploys.ethBridge.rollup).toMatch(
      /^0x[0-9a-fA-F]{40}$/,
    )
  })

  it("returns Arbitrum One's well-known canonical addresses", () => {
    const deploys = require_deploy_addresses(
      id_of(eip155_42161),
    )
    expect(deploys.name).toBe("Arbitrum One")
    expect(deploys.parentChainId).toBe(1)
    expect(deploys.isBold).toBe(true)
    expect(deploys.isTestnet).toBe(false)
    expect(deploys.confirmPeriodBlocks).toBe(45818)
    expect(deploys.ethBridge.bridge).toBe(
      "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a",
    )
    expect(deploys.ethBridge.sequencerInbox).toBe(
      "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6",
    )
    expect(deploys.ethBridge.outbox).toBe(
      "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840",
    )
    expect(deploys.ethBridge.rollup).toBe(
      "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0",
    )
    expect(deploys.ethBridge.classicOutboxes).toEqual({
      "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a": 0,
      "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40": 30,
    })
  })

  it("throws on a non-arbitrum-family chain", () => {
    expect(() =>
      require_deploy_addresses(id_of(eip155_1)),
    ).toThrow(/not an arbitrum-family chain/i)
  })
})
