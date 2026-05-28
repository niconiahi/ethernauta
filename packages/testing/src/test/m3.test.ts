// Phase 3 exit criterion + M3 coverage. Demonstrates that the
// `test()` endpoint composed into the project's `http(...)`
// transport answers reads end to end, and that both consumer
// paths from M3 work against an anvil unlocked account:
//   path 1: eth_sendTransaction (wallet-style — anvil signs)
//   path 2: eth_signTransaction + eth_sendRawTransaction
//           (primitive composition — dapp broadcasts)
//
// The path-1/path-2 signing calls go through the http transport
// directly rather than the project's `Signable<T>` bindings;
// Phase 6 lands the `create_signer`-compatible adapter that
// hides this detail behind the curried `method(args)(signer({
// chain_id }))` shape.

import { Hash32Schema, UintSchema } from "@ethernauta/core"
import { ResponseSchema, http } from "@ethernauta/transport"
import { parse, string } from "valibot"
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest"

import { await_ready } from "../spawner/await-ready"
import { pick_free_port } from "../spawner/pick-free-port"
import type { SpawnHandle } from "../spawner/spawn-anvil"
import { spawn_anvil } from "../spawner/spawn-anvil"

import { clear_endpoint, set_endpoint } from "./endpoint-store"
import { test as anvilTest } from "./test"

const isEnabled = process.env.ETHERNAUTA_TEST_ANVIL === "1"

// Account #0 derived from anvil's default mnemonic
// `test test test test test test test test test test test junk`.
// Phase 6 computes this from the mnemonic via @ethernauta/crypto;
// hardcoding here keeps the M3 demonstration self-contained.
const ACCOUNT_ZERO =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cfFFb92266"
const ACCOUNT_ONE =
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

describe.skipIf(!isEnabled)("test() — Phase 3 M3 coverage", () => {
  let handle: SpawnHandle
  let transport: ReturnType<typeof http>

  beforeAll(async () => {
    const port = await pick_free_port()
    handle = spawn_anvil({ port, extraArgs: ["--silent"] })
    await await_ready({ handle, timeoutMs: 10_000 })
    set_endpoint(`http://127.0.0.1:${port}`)
    transport = http(anvilTest())
  })

  afterAll(() => {
    clear_endpoint()
    handle.kill()
  })

  it("composes test() into http() and answers eth_blockNumber", async () => {
    const response = await transport([
      "eth_blockNumber",
      [],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    const blockNumber = parse(UintSchema, body.result)
    expect(blockNumber.startsWith("0x")).toBe(true)
  })

  it("M3 path 1: eth_sendTransaction against an unlocked account", async () => {
    const response = await transport([
      "eth_sendTransaction",
      [
        {
          from: ACCOUNT_ZERO,
          to: ACCOUNT_ONE,
          value: "0x1",
        },
      ],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    const txHash = parse(Hash32Schema, body.result)
    expect(txHash.startsWith("0x")).toBe(true)
  })

  it("M3 path 2: eth_signTransaction + eth_sendRawTransaction", async () => {
    const signResponse = await transport([
      "eth_signTransaction",
      [
        {
          from: ACCOUNT_ZERO,
          to: ACCOUNT_ONE,
          value: "0x1",
        },
      ],
    ])
    const signed = parse(ResponseSchema, signResponse)
    if ("error" in signed)
      throw new Error(signed.error.message)
    const rawTx = parse(string(), signed.result)
    const broadcastResponse = await transport([
      "eth_sendRawTransaction",
      [rawTx],
    ])
    const broadcast = parse(ResponseSchema, broadcastResponse)
    if ("error" in broadcast)
      throw new Error(broadcast.error.message)
    const txHash = parse(Hash32Schema, broadcast.result)
    expect(txHash.startsWith("0x")).toBe(true)
  })
})
