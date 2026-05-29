import { AddressSchema, BytesSchema } from "@ethernauta/core"
import type { Call, Response } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  RUNTIME_PREFIX,
  RUNTIME_SUFFIX,
} from "./bytecode"
import { deploy_clone } from "./deploy-clone"
import { get_clone_target } from "./get-clone-target"
import { is_clone, matches_runtime } from "./is-clone"

const PROXY = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)
const TARGET = parse(
  AddressSchema,
  "0x43506849d7c04f9138d1a2050bbf3a0c054402dd",
)
const NOT_A_PROXY_CODE = "0x6080604052"

function clone_runtime(target: string): string {
  return `${RUNTIME_PREFIX}${target.slice(2).toLowerCase()}${RUNTIME_SUFFIX}`
}

function transport_returning(
  code: string,
): (_call: Call) => Promise<Response> {
  return async (call: Call): Promise<Response> => {
    const [method] = call
    if (method !== "eth_getCode") {
      throw new Error(`unexpected method: ${method}`)
    }
    return { id: "1", jsonrpc: "2.0", result: code }
  }
}

describe("matches_runtime", () => {
  it("accepts a valid clone runtime", () => {
    expect(matches_runtime(clone_runtime(TARGET))).toBe(true)
  })

  it("rejects unrelated bytecode", () => {
    expect(matches_runtime(NOT_A_PROXY_CODE)).toBe(false)
  })

  it("rejects 45 bytes that don't start with the prefix", () => {
    const fake = `0x${"00".repeat(45)}`
    expect(matches_runtime(fake)).toBe(false)
  })
})

describe("is_clone", () => {
  it("detects a clone", async () => {
    const result = await is_clone(PROXY)([
      [transport_returning(clone_runtime(TARGET))],
      { chain_id: "eip155:1" },
    ])
    expect(result).toBe(true)
  })

  it("returns false for non-clone contract code", async () => {
    const result = await is_clone(PROXY)([
      [transport_returning(NOT_A_PROXY_CODE)],
      { chain_id: "eip155:1" },
    ])
    expect(result).toBe(false)
  })

  it("returns false for an EOA (empty code)", async () => {
    const result = await is_clone(PROXY)([
      [transport_returning("0x")],
      { chain_id: "eip155:1" },
    ])
    expect(result).toBe(false)
  })
})

describe("get_clone_target", () => {
  it("extracts the target address from a clone", async () => {
    const result = await get_clone_target(PROXY)([
      [transport_returning(clone_runtime(TARGET))],
      { chain_id: "eip155:1" },
    ])
    expect(result).toBe(TARGET)
  })

  it("returns not_found for non-clone code", async () => {
    const result = await get_clone_target(PROXY)([
      [transport_returning(NOT_A_PROXY_CODE)],
      { chain_id: "eip155:1" },
    ])
    expect(result).toBeNull()
  })
})

describe("deploy_clone", () => {
  it("produces creation bytecode that contains the runtime and target", () => {
    const init = deploy_clone(TARGET)
    expect(init.startsWith("0x3d602d80600a3d3981f3")).toBe(true)
    expect(
      init.toLowerCase().includes(TARGET.slice(2).toLowerCase()),
    ).toBe(true)
  })

  it("round-trips: the runtime portion of the init code is itself a valid clone", async () => {
    const init = deploy_clone(TARGET)
    const runtime = `0x${init.slice(22)}`
    expect(matches_runtime(runtime)).toBe(true)
    const result = await get_clone_target(PROXY)([
      [
        transport_returning(
          parse(BytesSchema, runtime.toLowerCase()),
        ),
      ],
      { chain_id: "eip155:1" },
    ])
    expect(result).toBe(TARGET)
  })
})
