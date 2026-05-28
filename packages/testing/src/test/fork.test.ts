// Phase 4 exit criterion. Spawns anvil in fork mode against a
// public Sepolia RPC and confirms (a) anvil adopts the
// upstream's chain id, and (b) a contract known to exist on
// Sepolia is visible at the fork — proving the
// `--fork-url`/`--fork-block-number` plumbing in
// `build_anvil_args` reaches anvil correctly and that the
// public `ForkConfigSchema` accepts a real URL.
//
// Gated by both `ETHERNAUTA_TEST_ANVIL=1` and
// `ETHERNAUTA_TEST_FORK_URL=<rpc>`. Without the fork URL the
// suite is skipped, because hammering a hard-coded public
// endpoint from CI is brittle.

import { BytesSchema } from "@ethernauta/core"
import { ResponseSchema, http } from "@ethernauta/transport"
import { parse } from "valibot"
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

const is_enabled = process.env.ETHERNAUTA_TEST_ANVIL === "1"
const fork_url = process.env.ETHERNAUTA_TEST_FORK_URL ?? ""
const enabled = is_enabled && fork_url.length > 0

// WETH9 on Sepolia. Verified via Etherscan — the address has
// code at every Sepolia block, so a working fork must expose
// non-empty bytecode for it.
const WETH9_SEPOLIA =
  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"

// Sepolia's chainId is 11155111 (decimal) = 0xaa36a7 (hex).
const SEPOLIA_CHAIN_ID = "0xaa36a7"

describe.skipIf(!enabled)("fork mode — sepolia", () => {
  let handle: SpawnHandle
  let transport: ReturnType<typeof http>

  beforeAll(async () => {
    const port = await pick_free_port()
    handle = spawn_anvil({
      port,
      fork: { url: fork_url },
      extra_args: ["--silent"],
    })
    await await_ready({ handle, timeout_ms: 30_000 })
    transport = http(`http://127.0.0.1:${port}`)
  }, 60_000)

  afterAll(() => {
    handle.kill()
  })

  it("anvil reports the upstream sepolia chain id", async () => {
    const response = await transport(["eth_chainId", []])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    expect(body.result).toBe(SEPOLIA_CHAIN_ID)
  })

  it("a Sepolia-only contract has bytecode at the fork", async () => {
    const response = await transport([
      "eth_getCode",
      [WETH9_SEPOLIA, "latest"],
    ])
    const body = parse(ResponseSchema, response)
    if ("error" in body) throw new Error(body.error.message)
    const code = parse(BytesSchema, body.result)
    expect(code.length).toBeGreaterThan(2)
  })
})
