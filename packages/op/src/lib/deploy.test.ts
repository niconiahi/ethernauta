import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { eip155_480 } from "@ethernauta/chain/eip155-480"
import { eip155_1868 } from "@ethernauta/chain/eip155-1868"
import { eip155_34443 } from "@ethernauta/chain/eip155-34443"
import { eip155_7777777 } from "@ethernauta/chain/eip155-7777777"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
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
    {
      chain: eip155_10,
      portal: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed",
    },
    {
      chain: eip155_11155420,
      portal: "0x16Fc5058F25648194471939df75CF27A2fdC48BC",
    },
    {
      chain: eip155_480,
      portal: "0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C",
    },
    {
      chain: eip155_1868,
      portal: "0x88e529A6ccd302c948689Cd5156C83D4614FAE92",
    },
    {
      chain: eip155_34443,
      portal: "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07",
    },
    {
      chain: eip155_7777777,
      portal: "0x1a0ad011913A150f69f6A19DF447A0CfD9551054",
    },
  ])(
    "returns the deploys for $chain.name",
    ({ chain, portal }) => {
      const deploys = require_deploy_addresses(id_of(chain))
      expect(deploys.contracts.OptimismPortalProxy).toBe(
        portal,
      )
    },
  )

  it("returns a structurally-complete payload with contracts + roles", () => {
    const deploys = require_deploy_addresses(id_of(eip155_10))
    expect(Object.keys(deploys)).toEqual([
      "contracts",
      "roles",
    ])
    expect(deploys.roles.Guardian).toMatch(
      /^0x[0-9a-fA-F]{40}$/,
    )
  })

  it("throws on a non-op-stack chain", () => {
    expect(() =>
      require_deploy_addresses(id_of(eip155_1)),
    ).toThrow(/not an op stack chain/i)
  })
})
