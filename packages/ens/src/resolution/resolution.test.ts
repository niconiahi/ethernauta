import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema } from "@ethernauta/core"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { get_ens_address } from "./get-ens-address"
import { get_ens_avatar } from "./get-ens-avatar"
import { get_ens_name } from "./get-ens-name"
import { get_ens_resolver } from "./get-ens-resolver"
import { get_ens_text } from "./get-ens-text"

// Promise.any in the reader picks the FIRST settled
// response — so adding RPCs that flake or rate-limit
// actively hurts (their error response can beat a good
// one to the line). Stick to one or two reliable
// endpoints.
const MAINNET_RPC_URLS = [
  "https://eth-mainnet.public.blastapi.io",
]

const VITALIK_ADDRESS = parse(
  AddressSchema,
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
)

const reader = create_reader([
  {
    chainId: encode_chain_id({
      namespace: "eip155",
      reference: eip155_1.chainId,
    }),
    transports: MAINNET_RPC_URLS.map((url) => http(url)),
  },
])

const ctx = reader({
  chain_id: encode_chain_id({
    namespace: "eip155",
    reference: eip155_1.chainId,
  }),
})

// TODO: connect integration test
describe.skip("ens resolution against mainnet", () => {
  it("should resolve the resolver address for vitalik.eth", async () => {
    const resolver = await get_ens_resolver({
      name: "vitalik.eth",
    })(ctx)
    expect(resolver).not.toBeNull()
    expect(resolver).toMatch(/^0x[0-9a-fA-F]{40}$/)
  }, 20_000)

  it("should forward-resolve vitalik.eth to its address", async () => {
    const addr = await get_ens_address({
      name: "vitalik.eth",
    })(ctx)
    expect(addr?.toLowerCase()).toBe(
      VITALIK_ADDRESS.toLowerCase(),
    )
  }, 20_000)

  it("should reverse-resolve vitalik's address to vitalik.eth", async () => {
    const name = await get_ens_name({
      address: VITALIK_ADDRESS,
    })(ctx)
    expect(name).toBe("vitalik.eth")
  }, 20_000)

  it("should read a text record", async () => {
    const url = await get_ens_text({
      name: "vitalik.eth",
      key: "url",
    })(ctx)
    // Vitalik's url record may or may not be set; just
    // assert the call succeeds and returns a string or
    // null, both shapes being valid surface.
    expect(url === null || typeof url === "string").toBe(
      true,
    )
  }, 20_000)

  it("should read the avatar text record", async () => {
    const avatar = await get_ens_avatar({
      name: "vitalik.eth",
    })(ctx)
    // vitalik's avatar is typically an NFT CAIP-19
    // reference or an http/ipfs URI; either is fine.
    expect(avatar).not.toBeNull()
  }, 20_000)

  it("should return null for an unregistered name", async () => {
    const addr = await get_ens_address({
      name: "this-name-definitely-does-not-exist-12345.eth",
    })(ctx)
    expect(addr).toBeNull()
  }, 20_000)

  it("should forward-resolve a basename via ENSIP-10 + CCIP-Read", async () => {
    const addr = await get_ens_address({
      name: "jesse.base.eth",
    })(ctx)
    expect(addr).not.toBeNull()
    expect(addr).toMatch(/^0x[0-9a-fA-F]{40}$/)
  }, 30_000)
})
