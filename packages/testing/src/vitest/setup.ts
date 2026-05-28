import { parse as devalue_parse } from "devalue"
import type {
  ResolvedReader,
  ResolvedWriter,
} from "@ethernauta/transport"
import { http } from "@ethernauta/transport"
import { parse } from "valibot"
import { afterEach, beforeEach } from "vitest"

import {
  evm_revert,
  evm_snapshot,
} from "../anvil/method"
import { await_ready } from "../spawner/await-ready"
import { pick_free_port } from "../spawner/pick-free-port"
import { register_cleanup } from "../spawner/signals"
import { spawn_anvil } from "../spawner/spawn-anvil"
import { TestConfigSchema } from "../test/config"
import { set_endpoint } from "../test/endpoint-store"

import { OPTIONS_ENV_VAR } from "./constants"
import { is_isolation_disabled } from "./isolation-state"

// Per-worker setup file injected by `ethernautaAnvil()` into
// vitest's `setupFiles` list. Vitest runs this in each worker
// before the worker's test files load, awaits the top-level
// async work, and then begins test execution. Module-level
// state set here (the endpoint in endpoint-store, the
// isolation flag) is per-worker and isolates naturally from
// sibling workers.

const raw = process.env[OPTIONS_ENV_VAR]
if (raw === undefined) {
  throw new Error(
    `[ethernauta] setup file loaded without ${OPTIONS_ENV_VAR} — did the ethernautaAnvil() plugin run?`,
  )
}

const options = parse(TestConfigSchema, devalue_parse(raw))
const port = options.port ?? (await pick_free_port())
const handle = spawn_anvil({
  port,
  chainId: options.chainId,
  accounts: options.accounts,
  mnemonic: options.mnemonic,
  blockTime: options.blockTime,
  baseFee: options.baseFee,
  hardfork: options.hardfork,
  fork: options.fork,
  extraArgs: options.extraArgs,
})
register_cleanup(handle)
await await_ready({ handle, timeoutMs: 30_000 })
const url = `http://127.0.0.1:${port}`
set_endpoint(url)

const isolate = options.isolate ?? true
if (isolate) {
  const transport = http(url)
  const reader: ResolvedReader = [
    [transport],
    { chain_id: "eip155:31337" },
  ]
  const writer: ResolvedWriter = [
    [transport],
    { chain_id: "eip155:31337" },
  ]
  let snapshotId: string | undefined

  beforeEach(async () => {
    if (is_isolation_disabled()) return
    snapshotId = await evm_snapshot()(reader)
  })

  afterEach(async () => {
    if (is_isolation_disabled()) return
    if (snapshotId === undefined) return
    await evm_revert([snapshotId])(writer)
    snapshotId = undefined
  })
}
