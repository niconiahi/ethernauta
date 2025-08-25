import { execSync } from "node:child_process"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import {
  DescriptionSchema,
  generate,
} from "@ethernauta/abi"
import { this_directory } from "@ethernauta/testing"
import { camel_to_kebab } from "@ethernauta/utils"
import { array, parse } from "valibot"
import { describe, expect, it } from "vitest"
import ERC165_ABI from "./IERC165.abi.json"

describe("ERC165", () => {
  it("should correctly generate the ERC165 method's files", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC165_ABI,
    )
    const functions = descriptions.filter((description) => {
      return description.type === "function"
    })
    const this_dir = this_directory(import.meta.url)
    generate(functions, this_dir)
    const methods_dir = join(this_dir, "methods")
    execSync(`biome format --write ${methods_dir}/*.ts`)
    const generated_files = readdirSync(methods_dir)
    for (const function_ of functions) {
      const file_name = `${camel_to_kebab(function_.name)}.ts`
      expect(generated_files).toContain(file_name)
    }
  })
})
