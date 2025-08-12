import { eip155_1 } from "@ethernauta/chain"

import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { eth_getBalance } from "./get-balance"

const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"

import { bigToUint } from "../../utils/big-to-uint"

describe("eth_getBalance", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = create_reader([
      {
        chainId: "eip155:1",
        transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
      },
    ])
    const readable = eth_getBalance([
      "0xF344B01DA08b142D2466dae9e47E333f22e64588",
      "earliest",
    ])
    const chainId = encode_chain_id({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const balance = await readable(reader(chainId))
    expect(balance).toBe(bigToUint(BigInt(0)))
  })
})
