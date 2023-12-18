import { describe } from "vitest"

import { getFunctions, getInputs } from "../json"

import erc20 from "./abi/erc20.abi.json"

describe("getInputs", () => {
  it("should correctly extract erc20 inputs", async () => {
    const inputs = getInputs(erc20)
    console.log("it => inputs =>", inputs)
  })
})

describe("getFunctions", () => {
  it("should correctly extract erc20 functions", async () => {
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
