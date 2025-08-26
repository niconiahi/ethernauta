import { execSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import {
  DescriptionSchema,
  generate,
} from "@ethernauta/abi"
import { camel_to_kebab } from "@ethernauta/utils"
import { array, parse } from "valibot"
import { describe, expect, it } from "vitest"
import { this_directory } from "../utils"
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
    generate(functions, this_dir)
    const methods_dir = join(this_dir, "methods")
    execSync(`biome format --write ${methods_dir}/*.ts`)
    const generated_files = readdirSync(methods_dir)
    for (const function_ of functions) {
      const file_name = `${camel_to_kebab(function_.name)}.ts`
      expect(generated_files).toContain(file_name)
    }
  })
  it("should create the correct transferFrom", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC721_ABI,
    )
    const functions = descriptions.filter((description) => {
      return description.type === "function"
    })
    const this_dir = this_directory(import.meta.url)
    generate(functions, this_dir)
    const methods_dir = join(this_dir, "methods")
    execSync(`biome format --write ${methods_dir}/*.ts`)
    const SNAPSHOT = `
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  parse,
  tuple,
  object,
  union,
  boolean,
} from "valibot"
import { addressSchema } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema]),
  object({
    owner: addressSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function isApprovedForAll(
  _parameters: Parameters,
): Readable<boolean> {
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
}`
    const path = join(
      this_dir,
      "methods",
      "is-approved-for-all.ts",
    )
    const content = readFileSync(path, { encoding: "utf8" })
    expect(content.trim()).toBe(SNAPSHOT.trim())
  })
})
