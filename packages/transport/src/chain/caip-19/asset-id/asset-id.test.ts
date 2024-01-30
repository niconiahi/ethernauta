import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { assetIdSchema } from "./asset-id"

describe("assetId", () => {
  it("should correctly parse a valid asset it", async () => {
    const raw = "eip155:1/erc721:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb/1"
    const assetId = parse(assetIdSchema, raw)
    expect(assetId).toBe(raw)
  })
})
