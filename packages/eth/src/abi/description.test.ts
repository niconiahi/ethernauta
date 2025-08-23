import { array, parse } from "valibot"
import { describe, expect, it } from "vitest"
import { DescriptionSchema } from "./description"
import ERC20_ABI from "./erc/20.abi.json"

describe("description.ts", () => {
  it("should parse the erc 20 abi json", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC20_ABI,
    )
    expect(descriptions).toHaveLength
  })
})
