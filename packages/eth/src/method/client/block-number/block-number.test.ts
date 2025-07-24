import { safeParse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  createReader,
  encodeChainId,
  http,
} from "../../../../../transport/src"
import { eip155_1 } from "../../../../../chain/src"
import { uintSchema } from "../../../core"

import { eth_blockNumber } from "./block-number"
import { ETHEREUM_SEPOLIA_RPC_URL } from "@utils/constants"

describe("eth_blockNumber", () => {
  it("should correctly get the latest mined block", async () => {
    const reader = createReader([
      {
        chainId: "eip155:1",
        transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
      },
    ])
    const readable = eth_blockNumber()
    const chainId = encodeChainId({
      namespace: "eip155",
      reference: eip155_1.chainId,
    })
    const blockNumber_ = await readable(reader(chainId))
    expect(blockNumber_).toSatisfy(
      (value) => safeParse(uintSchema, value).success,
    )
  })
})
