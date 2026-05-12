import { execSync } from "node:child_process"
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DescriptionSchema } from "@ethernauta/abi"
import { generate } from "@ethernauta/abi/generator"
import { camel_to_kebab } from "@ethernauta/utils"
import { array, parse } from "valibot"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import ERC721_ABI from "./IERC721.abi.json"

function format_and_read(
  path: string,
  content: string,
): string {
  writeFileSync(path, content)
  execSync(`biome format --write ${path}`)
  return readFileSync(path, { encoding: "utf8" })
}

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
      const file_name = `${camel_to_kebab(function_.name)}.ts`
      expect(generated_files).toContain(file_name)
    }
  })

  it("should create the correct isApprovedForAll", () => {
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
    const actual = readFileSync(
      join(methods_dir, "is-approved-for-all.ts"),
      { encoding: "utf8" },
    )
    const expected = format_and_read(
      join(methods_dir, "is-approved-for-all.expected.ts"),
      `import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse, tuple, object, union, boolean } from "valibot"
import { addressSchema } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema]),
  object({
    owner: addressSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function isApprovedForAll(_parameters: Parameters): Readable<boolean> {
  return async (transports: Http[]): Promise<boolean> => {
    const method = "isApprovedForAll"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([boolean()]),
      response.result,
    )
    return result
  }
}`,
    )
    expect(actual.trim()).toBe(expected.trim())
  })
})
