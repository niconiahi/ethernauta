// End-to-end demonstration of the two-files-total consumer
// experience promised in 01-scope.md. The companion
// `vitest.config.mjs` registers `ethernautaAnvil()`; this file
// only imports `test` from the package root and composes it
// through the project's `http(...)` transport.

import { UintSchema } from "@ethernauta/core"
import type {
  ResolvedReader,
  ResolvedWriter,
} from "@ethernauta/transport"
import { ResponseSchema, http } from "@ethernauta/transport"
import { parse } from "valibot"
import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest"

import { test as anvilTest } from "../dist/index.js"
import {
  anvil_setBalance,
  evm_mine,
} from "../dist/anvil/index.js"
import { without_isolation } from "../dist/vitest/index.js"

const url = anvilTest()
const transport = http(url)
const reader: ResolvedReader = [
  [transport],
  { chain_id: "eip155:31337" },
]
const writer: ResolvedWriter = [
  [transport],
  { chain_id: "eip155:31337" },
]

// Same well-known anvil-mnemonic account #0; the plugin spawned
// anvil with the default mnemonic, so this address is unlocked.
const ACCOUNT_ZERO =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cfFFb92266"

async function get_balance(address: string): Promise<string> {
  const response = await transport([
    "eth_getBalance",
    [address, "latest"],
  ])
  const body = parse(ResponseSchema, response)
  if ("error" in body) throw new Error(body.error.message)
  return parse(UintSchema, body.result).toString()
}

describe("plugin integration — endpoint reachable", () => {
  it("test() returns a working URL", async () => {
    const response = await transport([
      "eth_blockNumber",
      [],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    expect(parse(UintSchema, body.result).startsWith("0x")).toBe(
      true,
    )
  })
})

describe("plugin integration — default isolation", () => {
  it("test 1: mutates account-0 balance to a sentinel value", async () => {
    await anvil_setBalance([
      ACCOUNT_ZERO,
      parse(UintSchema, "0x123"),
    ])(writer)
    const balance = await get_balance(ACCOUNT_ZERO)
    expect(balance).toBe("0x123")
  })

  it("test 2: sees the original balance (revert worked)", async () => {
    const balance = await get_balance(ACCOUNT_ZERO)
    expect(balance).not.toBe("0x123")
  })
})

describe("plugin integration — without_isolation opt-out", () => {
  without_isolation()

  let blockBefore = ""

  beforeAll(async () => {
    const response = await transport([
      "eth_blockNumber",
      [],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    blockBefore = parse(UintSchema, body.result)
  })

  it("test 1: mines a block, raising the block number", async () => {
    await evm_mine()(writer)
  })

  it("test 2: sees the mined block (no revert between tests)", async () => {
    const response = await transport([
      "eth_blockNumber",
      [],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    const blockAfter = parse(UintSchema, body.result)
    expect(BigInt(blockAfter)).toBeGreaterThan(
      BigInt(blockBefore),
    )
  })
})
