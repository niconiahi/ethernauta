import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { tokenIdSchema } from "./token-id"

describe("tokenId", () => {
  it("should correctly parse a valid asset type", async () => {
    const raw = "1"
    const tokenId = parse(tokenIdSchema, raw)
    expect(tokenId).toBe(raw)
  })
})
