import type { Bytes } from "@ethernauta/core"
import { http } from "@ethernauta/transport"
import { parse as devalue_parse } from "devalue"
import { parse } from "valibot"
import { afterEach, beforeEach } from "vitest"

import { evm_revert, evm_snapshot } from "../anvil/methods"
import { await_ready } from "../spawner/await-ready"
import { pick_free_port } from "../spawner/pick-free-port"
import { register_cleanup } from "../spawner/signals"
import { spawn_anvil } from "../spawner/spawn-anvil"
import { TestConfigSchema } from "../test/config"
import {
  create_testing_reader,
  create_testing_writer,
} from "../test/create-testing-reader"
import {
  DEFAULT_ANVIL_MNEMONIC,
  set_endpoint,
  set_mnemonic,
} from "../test/endpoint-store"

import { is_isolation_disabled } from "../test/isolation-state"

import { OPTIONS_ENV_VAR } from "./constants"

// Per-worker setup file injected by `ethernauta_anvil()` into
// vitest's `setupFiles` list. Vitest runs this in each worker
// before the worker's test files load, awaits the top-level
// async work, and then begins test execution. Module-level
// state set here (the endpoint in endpoint-store, the
// isolation flag) is per-worker and isolates naturally from
// sibling workers.

const raw = process.env[OPTIONS_ENV_VAR]
if (raw === undefined) {
  throw new Error(
    `[ethernauta] setup file loaded without ${OPTIONS_ENV_VAR} — did the ethernauta_anvil() plugin run?`,
  )
}

const options = parse(TestConfigSchema, devalue_parse(raw))
const port = options.port ?? (await pick_free_port())
const handle = spawn_anvil({
  port,
  chain_id: options.chain_id,
  accounts: options.accounts,
  mnemonic: options.mnemonic,
  block_time: options.block_time,
  base_fee: options.base_fee,
  hardfork: options.hardfork,
  fork: options.fork,
  extra_args: options.extra_args,
})
register_cleanup(handle)
await await_ready({ handle, timeout_ms: 30_000 })
const url = `http://127.0.0.1:${port}`
set_endpoint(url)
set_mnemonic(options.mnemonic ?? DEFAULT_ANVIL_MNEMONIC)

const isolate = options.isolate ?? true
if (isolate) {
  const transport = http(url)
  const resolver_options = { chain_id: "eip155:31337" }
  const reader = create_testing_reader(resolver_options)(
    transport,
  )
  const writer = create_testing_writer(resolver_options)(
    transport,
  )
  let snapshot_id: Bytes | undefined

  beforeEach(async () => {
    if (is_isolation_disabled()) return
    snapshot_id = await evm_snapshot()(reader)
  })

  afterEach(async () => {
    if (is_isolation_disabled()) return
    if (snapshot_id === undefined) return
    await evm_revert([snapshot_id])(writer)
    snapshot_id = undefined
  })
}
