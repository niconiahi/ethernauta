import { execSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DescriptionSchema } from "@ethernauta/abi"
import {
  emit_file_basename_for,
  generate,
} from "@ethernauta/abi/generator"
import { array, parse } from "valibot"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"
import ERC721_ABI from "./IERC721.abi.json"

describe("ERC721", () => {
  let tmp_dir: string

  beforeEach(() => {
    tmp_dir = mkdtempSync(join(tmpdir(), "erc721-"))
  })

  afterEach(() => {
    rmSync(tmp_dir, { recursive: true })
  })

  it("should correctly generate the ERC721 method's files", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC721_ABI,
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
      const file_name = `${emit_file_basename_for(function_, functions)}.ts`
      expect(generated_files).toContain(file_name)
    }
  })
})
