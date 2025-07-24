import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { assetNameSchema } from "./asset-name"

describe("assetName", () => {
  it("should correctly parse a valid asset name", async () => {
    const raw = "erc721:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb"
    const assetName = parse(assetNameSchema, raw)
    expect(assetName).toBe(raw)
  })
})
