import { parse } from "valibot"
import { describe } from "vitest"

import { chainIdSchema } from "./chain-id"

describe("chainId", () => {
  it("should correctly validate positvely a valid chain id", async () => {
    const raw = "eip155:1"
    const chainId = parse(chainIdSchema, raw)
    expect(chainId).toBe(raw)
  })
})
