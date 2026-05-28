import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { TokenIdSchema } from "./token-id"

describe("token-id.ts", () => {
  it("should correctly parse a valid asset type", async () => {
    const raw = "1"
    const token_id = parse(TokenIdSchema, raw)
    expect(token_id).toBe(raw)
  })
})
