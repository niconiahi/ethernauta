import { describe, expect, it } from "vitest"

import {
  createReader,
  encodeChainId,
  http,
} from "@ethernauta/transport"

import { eip155_1 } from "@ethernauta/chain"

import { eth_getBalance } from "./get-balance"
import { ETHEREUM_SEPOLIA_RPC_URL } from "@utils/constants"
import { bigToUint } from "../../utils/big-to-uint"

describe("eth_getBalance", () => {
  it("should correctly get the initial balance of a given address as zero", async () => {
    const reader = createReader([
      {
        chainId: "eip155:1",
        transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
      },
    ])
    const readable = eth_getBalance([
      "0xF344B01DA08b142D2466dae9e47E333f22e64588",
      "earliest",
    ])
    const chainId = encodeChainId({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const balance = await readable(reader(chainId))
    expect(balance).toBe(bigToUint(BigInt(0)))
  })
})
