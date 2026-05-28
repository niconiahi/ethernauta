// End-to-end demonstration of the two-files-total consumer
// experience promised in 01-scope.md. The companion
// `vitest.config.mjs` registers `ethernauta_anvil()`; this file
// only imports `anvil` from the package root and composes it
// through both M3 seams.

import { UintSchema } from "@ethernauta/core"
import { create_provider, http, ResponseSchema } from "@ethernauta/transport"
import { parse } from "valibot"
import { beforeAll, describe, expect, it } from "vitest"

import {
  anvil,
  anvil_account,
  anvil_setBalance,
  create_testing_provider,
  evm_mine,
  without_isolation,
} from "@ethernauta/testing"

const transport = http(anvil())
const resolver = create_provider(create_testing_provider(anvil()))

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
  it("anvil() returns a working URL for path-2 reads", async () => {
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

  it("create_provider(anvil()) returns a usable resolver pair", async () => {
    const [transports] = resolver.reader({
      chain_id: "eip155:31337",
    })
    expect(transports.length).toBeGreaterThan(0)
  })
})

describe("plugin integration — default isolation", () => {
  it("test 1: mutates account-0 balance to a sentinel value", async () => {
    const account = anvil_account(0)
    await anvil_setBalance([
      account.address,
      parse(UintSchema, "0x123"),
    ])([[transport], { chain_id: "eip155:31337" }])
    const balance = await get_balance(account.address)
    expect(balance).toBe("0x123")
  })

  it("test 2: sees the original balance (revert worked)", async () => {
    const account = anvil_account(0)
    const balance = await get_balance(account.address)
    expect(balance).not.toBe("0x123")
  })
})

describe("plugin integration — without_isolation opt-out", async () => {
  await without_isolation()

  let block_before = ""

  beforeAll(async () => {
    const response = await transport([
      "eth_blockNumber",
      [],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    block_before = parse(UintSchema, body.result)
  })

  it("test 1: mines a block, raising the block number", async () => {
    await evm_mine()([
      [transport],
      { chain_id: "eip155:31337" },
    ])
  })

  it("test 2: sees the mined block (no revert between tests)", async () => {
    const response = await transport([
      "eth_blockNumber",
      [],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    const block_after = parse(UintSchema, body.result)
    expect(BigInt(block_after)).toBeGreaterThan(
      BigInt(block_before),
    )
  })
})
