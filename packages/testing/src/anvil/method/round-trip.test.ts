import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  ResolvedReader,
  ResolvedWriter,
} from "@ethernauta/transport"
import { http } from "@ethernauta/transport"
import { parse } from "valibot"
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest"

import { await_ready } from "../../spawner/await-ready"
import { pick_free_port } from "../../spawner/pick-free-port"
import type { SpawnHandle } from "../../spawner/spawn-anvil"
import { spawn_anvil } from "../../spawner/spawn-anvil"

import { anvil_dumpState } from "./anvil-dump-state"
import { anvil_impersonateAccount } from "./anvil-impersonate-account"
import { anvil_loadState } from "./anvil-load-state"
import { anvil_setBalance } from "./anvil-set-balance"
import { anvil_setCode } from "./anvil-set-code"
import { anvil_setStorageAt } from "./anvil-set-storage-at"
import { evm_increaseTime } from "./evm-increase-time"
import { evm_mine } from "./evm-mine"
import { evm_revert } from "./evm-revert"
import { evm_snapshot } from "./evm-snapshot"

// Gated by `ETHERNAUTA_TEST_ANVIL=1`. The block is skipped in
// normal `pnpm test` runs because anvil is not available in CI
// and the spawn-and-wait cost is meaningful.
const isEnabled = process.env.ETHERNAUTA_TEST_ANVIL === "1"

describe.skipIf(!isEnabled)("anvil RPC bindings", () => {
  let handle: SpawnHandle
  let resolvedReader: ResolvedReader
  let resolvedWriter: ResolvedWriter

  beforeAll(async () => {
    const port = await pick_free_port()
    handle = spawn_anvil({ port, extraArgs: ["--silent"] })
    await await_ready({ handle, timeoutMs: 10_000 })
    const transport = http(`http://127.0.0.1:${port}`)
    resolvedReader = [[transport], { chain_id: "eip155:31337" }]
    resolvedWriter = [[transport], { chain_id: "eip155:31337" }]
  })

  afterAll(() => {
    handle.kill()
  })

  it("evm_snapshot returns a hex id and evm_revert consumes it", async () => {
    const id = await evm_snapshot()(resolvedReader)
    expect(id.startsWith("0x")).toBe(true)
    const ok = await evm_revert([id])(resolvedWriter)
    expect(ok).toBe(true)
  })

  it("evm_mine returns the placeholder \"0x0\"", async () => {
    const result = await evm_mine()(resolvedWriter)
    expect(result).toBe("0x0")
  })

  it("evm_increaseTime returns the new timestamp as bigint", async () => {
    const seconds = parse(UintSchema, "0x3c")
    const newTimestamp = await evm_increaseTime([
      seconds,
    ])(resolvedWriter)
    expect(typeof newTimestamp).toBe("bigint")
    expect(newTimestamp).toBeGreaterThan(0n)
  })

  it("anvil_impersonateAccount returns null", async () => {
    const address = parse(
      AddressSchema,
      "0x0000000000000000000000000000000000000001",
    )
    const result = await anvil_impersonateAccount([
      address,
    ])(resolvedWriter)
    expect(result).toBeNull()
  })

  it("anvil_setBalance returns null", async () => {
    const address = parse(
      AddressSchema,
      "0x0000000000000000000000000000000000000002",
    )
    const balance = parse(UintSchema, "0xde0b6b3a7640000")
    const result = await anvil_setBalance([
      address,
      balance,
    ])(resolvedWriter)
    expect(result).toBeNull()
  })

  it("anvil_setStorageAt returns true", async () => {
    const address = parse(
      AddressSchema,
      "0x0000000000000000000000000000000000000003",
    )
    const slot = parse(UintSchema, "0x0")
    const value = parse(Bytes32Schema, `0x${"1".repeat(64)}`)
    const result = await anvil_setStorageAt([
      address,
      slot,
      value,
    ])(resolvedWriter)
    expect(result).toBe(true)
  })

  it("anvil_setCode returns null", async () => {
    const address = parse(
      AddressSchema,
      "0x0000000000000000000000000000000000000004",
    )
    const code = parse(BytesSchema, "0x6001600101")
    const result = await anvil_setCode([
      address,
      code,
    ])(resolvedWriter)
    expect(result).toBeNull()
  })

  it("anvil_dumpState round-trips through anvil_loadState", async () => {
    const dumped = await anvil_dumpState()(resolvedReader)
    expect(dumped.startsWith("0x")).toBe(true)
    const loaded = await anvil_loadState([
      dumped,
    ])(resolvedWriter)
    expect(loaded).toBe(true)
  })
})
