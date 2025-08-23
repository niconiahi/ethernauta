import { readdirSync } from "node:fs"
import { join } from "node:path"
import { array, parse } from "valibot"
import { describe, expect, it } from "vitest"
import { DescriptionSchema } from "../../abi/description"
import { compile } from "../../compiler"
import { camel_to_kebab } from "../../utils/camel-to-kebab"
import { this_directory } from "../../utils/this-directory"
import ERC721_ABI from "./IERC721.abi.json"

describe("ERC721", () => {
  it("should correctly generate the ERC721 method's files", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC721_ABI,
    )
    const functions = descriptions.filter((description) => {
      return description.type === "function"
    })
    const this_dir = this_directory(import.meta.url)
    compile(functions, this_dir)
    const methods_dir = join(this_dir, "methods")
    const generated_files = readdirSync(methods_dir)
    for (const function_ of functions) {
      const file_name = `${camel_to_kebab(function_.name)}.ts`
      expect(generated_files).toContain(file_name)
    }
  })
})
