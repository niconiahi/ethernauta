import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { assetTypeSchema } from "./asset-type"

describe("assetType", () => {
  it("should correctly parse a valid asset type", async () => {
    const raw = "eip155:1/erc721:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb"
    const assetType = parse(assetTypeSchema, raw)
    expect(assetType).toBe(raw)
  })
})
