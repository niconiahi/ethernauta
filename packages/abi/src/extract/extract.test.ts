import { describe } from "vitest"

import erc20 from "./abi/erc20.abi.json"
import { extract } from "./extract"

describe("extract", () => {
  it("should correctly extract erc20 from json", async () => {
    const abi = extract(erc20)
    // eslint-disable-next-line no-console
    console.log("it => abi =>", abi)
  })
})
