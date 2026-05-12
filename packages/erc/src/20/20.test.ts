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
import ERC20_ABI from "./IERC20.abi.json"

function format_and_read(
  path: string,
  content: string,
): string {
  writeFileSync(path, content)
  execSync(`biome format --write ${path}`)
  return readFileSync(path, { encoding: "utf8" })
}

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

  it("should create the correct transferFrom", () => {
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
    const actual = readFileSync(
      join(methods_dir, "transfer-from.ts"),
      { encoding: "utf8" },
    )
    const expected = format_and_read(
      join(methods_dir, "transfer-from.expected.ts"),
      `import type { Signable, Signer } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse, tuple, object, union, boolean } from "valibot"
import { addressSchema, uint256Schema } from "@ethernauta/eth"

export const OutputSchema = union([boolean()])
export type Output = InferOutput<typeof OutputSchema>

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    from: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function transferFrom(_parameters: Parameters): Signable<string> {
  return (_signer: Signer): Promise<string> => {
    const parameters = parse(parametersSchema, _parameters)
    return _signer("transferFrom", parameters)
  }
}`,
    )
    expect(actual.trim()).toBe(expected.trim())
  })

  it("should create the correct totalSupply", () => {
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
    const actual = readFileSync(
      join(methods_dir, "total-supply.ts"),
      { encoding: "utf8" },
    )
    const expected = format_and_read(
      join(methods_dir, "total-supply.expected.ts"),
      `import type { Http, Readable } from "@ethernauta/transport"
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
}`,
    )
    expect(actual.trim()).toBe(expected.trim())
  })
})
