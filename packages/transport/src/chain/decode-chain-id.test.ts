import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { chainIdSchema } from "./chain-id"
import { decode_chain_id } from "./decode-chain-id"

describe("decode-chain-id.ts", () => {
  it("should correctly parse a decode a valid chain id", async () => {
    const raw = "eip155:1"
    const chainId = parse(chainIdSchema, raw)
    const decoded = decode_chain_id(chainId)
    expect(decoded).toEqual({
      namespace: "eip155",
      reference: "1",
    })
  })
})
