import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { chainIdSchema } from "../chain-id"

import { decodeChainId } from "./decode-chain-id"

describe("decodeChainId", () => {
  it("should correctly parse a decode a valid chain id", async () => {
    const raw = "eip155:1"
    const chainId = parse(chainIdSchema, raw)
    const decoded = decodeChainId(chainId)
    expect(decoded).toEqual({ namespace: "eip155", reference: "1" })
  })
})
