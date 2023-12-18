import { describe } from "vitest"

import { getFunctions, getInputs } from "../json"

import erc20 from "./abi/erc20.abi.json"

describe("extract", () => {
  it("should correctly extract erc20 from json", async () => {
    const inputs = getInputs(erc20)
    const functions = getFunctions(inputs)

    const files = functions
      .map(input => ({
        fileName: input.name,
        content: ``,
      }))
    console.log("it => files =>", files)
  })
})
