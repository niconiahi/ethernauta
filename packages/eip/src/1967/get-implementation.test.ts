import { AddressSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { get_admin } from "./get-admin"
import { get_beacon } from "./get-beacon"
import { get_implementation } from "./get-implementation"
import {
  ADMIN_SLOT,
  BEACON_SLOT,
  IMPLEMENTATION_SLOT,
} from "./slots"

const PROXY = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)
const IMPL = "0x43506849d7c04f9138d1a2050bbf3a0c054402dd"
const ADMIN = "0x7e4a8391c728fed9069b2962699ab416628b19fa"
const BEACON = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"

const testing_reader = create_testing_reader()

function transport_for(
  expected_slot: string,
  return_word: string,
): (_call: Call) => Promise<Response> {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_getStorageAt") {
      throw new Error(`unexpected method: ${method}`)
    }
    if (!Array.isArray(params) || params.length !== 3) {
      throw new Error("bad params shape")
    }
    if (params[1] !== expected_slot) {
      throw new Error(
        `expected slot ${expected_slot}, got ${String(params[1])}`,
      )
    }
    return {
      id: "1",
      jsonrpc: "2.0",
      result: return_word,
    }
  }
}

describe("get_implementation", () => {
  it("returns the address from the implementation slot", async () => {
    const transport = transport_for(
      IMPLEMENTATION_SLOT,
      `0x000000000000000000000000${IMPL.slice(2)}`,
    )
    const result = await get_implementation(PROXY)(testing_reader(transport))
    expect(result).toBe(IMPL)
  })

  it("normalizes minified hex (no leading zero pad)", async () => {
    const transport = transport_for(
      IMPLEMENTATION_SLOT,
      IMPL,
    )
    const result = await get_implementation(PROXY)(testing_reader(transport))
    expect(result).toBe(IMPL)
  })

  it("returns not_found for a zero slot (minified)", async () => {
    const transport = transport_for(
      IMPLEMENTATION_SLOT,
      "0x0",
    )
    const result = await get_implementation(PROXY)(testing_reader(transport))
    expect(result).toBeNull()
  })

  it("returns not_found for a zero slot (fully padded)", async () => {
    const transport = transport_for(
      IMPLEMENTATION_SLOT,
      `0x${"0".repeat(64)}`,
    )
    const result = await get_implementation(PROXY)(testing_reader(transport))
    expect(result).toBeNull()
  })
})

describe("get_admin", () => {
  it("reads the admin slot", async () => {
    const transport = transport_for(
      ADMIN_SLOT,
      `0x000000000000000000000000${ADMIN.slice(2)}`,
    )
    const result = await get_admin(PROXY)(testing_reader(transport))
    expect(result).toBe(ADMIN)
  })
})

describe("get_beacon", () => {
  it("reads the beacon slot", async () => {
    const transport = transport_for(
      BEACON_SLOT,
      `0x000000000000000000000000${BEACON.slice(2)}`,
    )
    const result = await get_beacon(PROXY)(testing_reader(transport))
    expect(result).toBe(BEACON)
  })
})

describe("slot constants", () => {
  it("match the EIP-1967 spec values", () => {
    expect(IMPLEMENTATION_SLOT).toBe(
      "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
    )
    expect(ADMIN_SLOT).toBe(
      "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
    )
    expect(BEACON_SLOT).toBe(
      "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
    )
  })
})
