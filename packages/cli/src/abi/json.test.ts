import { array, parse } from "valibot"
import { describe, expect, it } from "vitest"
import ERC20_ABI from "./erc/20.abi.json"
import { DescriptionSchema } from "./json"

describe("json.ts", () => {
  it("should parse the erc 20 abi json", () => {
    const json = parse(array(DescriptionSchema), ERC20_ABI)
    expect(json).toHaveLength
  })
})
