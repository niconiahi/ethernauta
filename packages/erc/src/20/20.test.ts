import { execSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DescriptionSchema } from "@ethernauta/abi"
import { generate } from "@ethernauta/abi/generator"
import { camel_to_kebab } from "@ethernauta/utils"
import { array, parse } from "valibot"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"
import ERC20_ABI from "./IERC20.abi.json"

describe("ERC20", () => {
  let tmp_dir: string

  beforeEach(() => {
    tmp_dir = mkdtempSync(join(tmpdir(), "erc20-"))
  })

  afterEach(() => {
    rmSync(tmp_dir, { recursive: true })
  })

  it("should correctly generate the ERC20 method's files", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC20_ABI,
    )
    const functions = descriptions.filter((description) => {
      return description.type === "function"
    })
    generate(functions, tmp_dir)
    const methods_dir = join(tmp_dir, "methods")
    execSync(`biome format --write ${methods_dir}/*.ts`)
    const generated_files = execSync(`ls ${methods_dir}`)
      .toString()
      .trim()
      .split("\n")
    for (const function_ of functions) {
      const file_name = `${camel_to_kebab(function_.name)}.ts`
      expect(generated_files).toContain(file_name)
    }
  })

})
