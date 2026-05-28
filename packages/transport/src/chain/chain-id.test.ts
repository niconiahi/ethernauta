import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { ChainIdSchema } from "./chain-id"

describe("chaind-id.ts", () => {
  it("should correctly validate positvely a valid chain id", async () => {
    const raw = "eip155:1"
    const chain_id = parse(ChainIdSchema, raw)
    expect(chain_id).toBe(raw)
  })
})
