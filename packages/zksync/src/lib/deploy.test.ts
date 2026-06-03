import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { eip155_324 } from "@ethernauta/chain/eip155-324"
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
  it.each([eip155_324, eip155_300])(
    "round-trips a payload for $name",
    (chain) => {
      const deploys = require_deploy_addresses(id_of(chain))
      expect(deploys.name).toBeTypeOf("string")
      expect(deploys.parentChainId).toBeTypeOf("number")
      expect(deploys.isTestnet).toBeTypeOf("boolean")
      expect(deploys.l1.bridgehub).toMatch(
        /^0x[0-9a-fA-F]{40}$/,
      )
      expect(deploys.l1.assetRouter).toMatch(
        /^0x[0-9a-fA-F]{40}$/,
      )
      expect(deploys.l1.l1Nullifier).toMatch(
        /^0x[0-9a-fA-F]{40}$/,
      )
      expect(deploys.l1.baseToken).toMatch(
        /^0x[0-9a-fA-F]{40}$/,
      )
    },
  )

  it("returns zkSync Era's well-known bridgehub address", () => {
    const deploys = require_deploy_addresses(
      id_of(eip155_324),
    )
    expect(deploys.name).toBe("zkSync Era")
    expect(deploys.parentChainId).toBe(1)
    expect(deploys.l1.bridgehub).toBe(
      "0x303a465B659cBB0ab36eE643eA362c509EEb5213",
    )
    expect(deploys.l1.baseToken).toBe(
      "0x0000000000000000000000000000000000000001",
    )
  })

  it("returns Era Sepolia's bridgehub + flags it testnet", () => {
    const deploys = require_deploy_addresses(
      id_of(eip155_300),
    )
    expect(deploys.name).toBe("zkSync Era Sepolia")
    expect(deploys.parentChainId).toBe(11155111)
    expect(deploys.isTestnet).toBe(true)
    expect(deploys.l1.bridgehub).toBe(
      "0x35A54c8C757806eB6820629bc82d90E056394C92",
    )
  })

  it("throws for an unregistered chain id", () => {
    const missing = encode_chain_id({
      namespace: "eip155",
      reference: 999999,
    })
    expect(() => require_deploy_addresses(missing)).toThrow(
      /not a zksync-family chain/,
    )
  })
})
