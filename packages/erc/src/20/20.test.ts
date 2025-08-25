import { execSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import {
  DescriptionSchema,
  generate,
} from "@ethernauta/abi"
import { this_directory } from "@ethernauta/testing"
import { camel_to_kebab } from "@ethernauta/utils"
import { array, parse } from "valibot"
import { describe, expect, it } from "vitest"
import ERC20_ABI from "./IERC20.abi.json"

describe("ERC20", () => {
  it("should correctly generate the ERC20 method's files", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC20_ABI,
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
  it("should create the correct total supply", () => {
    const descriptions = parse(
      array(DescriptionSchema),
      ERC20_ABI,
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
import { parse, union } from "valibot"
import { uint256Schema } from "@ethernauta/eth"
import type { Uint256 } from "@ethernauta/eth"

export function totalSupply(): Readable<Uint256> {
  return async (transports: Http[]): Promise<Uint256> => {
    const method = "totalSupply"
    const call = parse(callSchema, [method, []])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([uint256Schema]),
      response.result,
    )
    return result
  }
}`
    const path = join(
      this_dir,
      "methods",
      "total-supply.ts",
    )
    const content = readFileSync(path, { encoding: "utf8" })
    expect(content.trim()).toBe(SNAPSHOT.trim())
  })
})
