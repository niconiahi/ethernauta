---
title: Testing with anvil
section: Tooling
section_order: 4
order: 3
---

# Testing dapps against a local EVM

`@ethernauta/testing` is the vitest-first testing utility for
`@ethernauta/*` consumers. It owns the anvil lifecycle, so you
don't write a `globalSetup` file or a kill-the-subprocess
handler — you wire one plugin into `vitest.config.ts`, import
the package, and your existing `create_reader` /
`create_provider` composition runs against a freshly spawned
anvil per worker.

## Install

```bash
pnpm add -D @ethernauta/testing
```

[Foundry](https://book.getfoundry.sh) is a separate, local
binary you bring yourself:

```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

If `anvil` is missing from `$PATH`, the plugin fails fast on
startup with the same one-liner.

## The two-files-total flow

```ts
// vitest.config.ts — one line, set-and-forget
import { defineConfig } from "vitest/config"
import { ethernauta_anvil } from "@ethernauta/testing"

export default defineConfig({ plugins: [ethernauta_anvil()] })
```

```ts
// some.test.ts
import {
  create_provider,
  create_reader,
  http,
} from "@ethernauta/transport"
import {
  anvil,
  anvil_account,
  create_testing_provider,
} from "@ethernauta/testing"

// path 2 (no wallet) — raw RPC reads
const reader = create_reader([
  { chainId: "eip155:31337", transports: [http(anvil())] },
])

// path 1 (wallet-shape) — same call site as production's
// `create_provider(window.ethereum)`, only the provider source
// differs.
const provider = create_provider(create_testing_provider(anvil()))
const account = anvil_account(0)
```

The information is the URL of the running anvil; `anvil()`
returns it. `http(...)` consumes it directly; `create_provider`
consumes the 1193 Provider that `create_testing_provider`
wraps around it. Both M3 paths first-class, no parallel API.

## Forked mainnet (and others)

Pass a fork URL to the plugin. Anvil adopts the upstream's chain
id; reads return the upstream's state at the fork block.

```ts
import { defineConfig } from "vitest/config"
import { ethernauta_anvil } from "@ethernauta/testing"

export default defineConfig({
  plugins: [
    ethernauta_anvil({
      fork: {
        url: "https://sepolia.gateway.tenderly.co",
        block_number: 7_000_000n,
      },
    }),
  ],
})
```

The fork URL is validated at the plugin boundary — a typo
throws before anvil spawns, with the actual `valibot` error.

## Default isolation: snapshot/revert around each test

The plugin takes an `evm_snapshot` before each test and
`evm_revert`s after. State mutations in one test don't bleed
into the next. This is on by default — no boilerplate.

Two ways to opt out:

```ts
// Suite-wide — set at plugin construction
import { ethernauta_anvil } from "@ethernauta/testing"

ethernauta_anvil({ isolate: false })
```

```ts
// Per-describe — for blocks that deliberately accumulate
// state (deploy once, read many)
import { without_isolation } from "@ethernauta/testing"
import { beforeAll, describe, it } from "vitest"

declare function deploy_contract(): Promise<void>
declare function read_balance(account: string): Promise<bigint>

describe("read battery", async () => {
  await without_isolation()

  beforeAll(deploy_contract)
  it("balanceOf alice", async () => { await read_balance("alice") })
  it("balanceOf bob", async () => { await read_balance("bob") })
})
```

`without_isolation()` is async — it dynamic-imports `vitest`
inside its body so the root barrel stays free of top-level
`"vitest"` references (otherwise importing `ethernauta_anvil`
from the same barrel inside `vitest.config.ts` would trip
vitest's "no vitest inside config" guard). Call it with
`await` from inside an `async` `describe` callback. It
restores the previous isolation value on `afterAll`, so
nesting works.

## Account / signer helpers

Anvil pre-funds 10 accounts from a known mnemonic. The package
materialises the same derivation in-process so you can address
them by index:

```ts
import { anvil_account, anvil_accounts } from "@ethernauta/testing"

const account = anvil_account(0)              // first pre-funded
const all = anvil_accounts()                  // canonical 10
const more = anvil_accounts(20)               // arbitrary count
```

Each `AnvilAccount` is `{ address, private_key }`. The
`private_key` is a raw 32-byte `Uint8Array`; the `address` is
the Ethereum address derived via `keccak256(uncompressed_pubkey)[-20:]`.

A custom mnemonic (passed via `ethernauta_anvil({ mnemonic: ... })`)
flows through — the helper reads from the same shared state
the plugin sets.

## Overrides

The plugin's options are passed straight to the anvil CLI:

| Option | Anvil flag |
|---|---|
| `chain_id` | `--chain-id <N>` |
| `accounts` | `--accounts <N>` |
| `mnemonic` | `--mnemonic <phrase>` |
| `block_time` | `--block-time <seconds>` |
| `base_fee` | `--base-fee <wei>` |
| `hardfork` | `--hardfork <name>` |
| `fork.url` | `--fork-url <url>` |
| `fork.block_number` | `--fork-block-number <N>` |
| `port` | `--port <N>` (default: kernel-picked) |

For anything not yet wired as a first-class option, use the
`extra_args: string[]` escape hatch:

```ts
import { ethernauta_anvil } from "@ethernauta/testing"

ethernauta_anvil({ extra_args: ["--silent", "--gas-limit", "30000000"] })
```

Any flag a second consumer asks for graduates to first-class.

## CI

We don't ship a GitHub Action. Foundry provides
[`foundry-rs/foundry-toolchain`](https://github.com/foundry-rs/foundry-toolchain),
which installs anvil on the runner — drop it in your workflow
before `pnpm test`:

```yaml
- uses: foundry-rs/foundry-toolchain@v1
- run: pnpm install
- run: pnpm test
```

That's the whole CI story. We do not automate around it.

## Unit-testing methods without anvil

Anvil is the right tool for integration tests. For unit tests
of a single method binding — you control the RPC response, you
just want to call the method against a fake transport — anvil
is overkill. `create_testing_reader` / `create_testing_writer`
wrap a single `Http` transport into a `ResolvedReader` /
`ResolvedWriter` so you don't repeat the resolver-tuple
boilerplate at every call site.

```ts
import { create_testing_reader } from "@ethernauta/testing"
import { eth_getBalance } from "@ethernauta/eth"
import type { Call, Response } from "@ethernauta/transport"

const testing_reader = create_testing_reader() // defaults to chain_id "eip155:1"

const fake_transport = async (_call: Call): Promise<Response> => ({
  jsonrpc: "2.0",
  id: "1",
  result: "0xde0b6b3a7640000",
})

const balance = await eth_getBalance([HOLDER, "latest"])(
  testing_reader(fake_transport),
)
expect(balance).toBe("0xde0b6b3a7640000")
```

The factory accepts `{ chain_id }` for tests that target a
specific chain — pair with `encode_chain_id` to keep the
chain id branded:

```ts
import { create_testing_reader } from "@ethernauta/testing"
import { encode_chain_id } from "@ethernauta/transport"
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})
const testing_reader = create_testing_reader({ chain_id: CHAIN_ID })
```

`create_testing_writer` is the matching shape for
`ResolvedWriter`; both wrap into a single-transport
`Dispatcher` under the hood so the method's call shape is
identical to production.

## Exports

Everything ships from the package root — `anvil()`,
`anvil_account`, `anvil_accounts`, `create_testing_provider`,
`create_testing_reader`, `create_testing_writer`,
`without_isolation`, the config schemas, the
`ethernauta_anvil()` vitest plugin, and the anvil RPC
bindings (`evm_*`, `anvil_*`). No subpaths.

## What `@ethernauta/testing` is not

- **A mock.** When foundry is missing, the plugin throws — it
  never silently falls back. The value proposition is the real
  EVM, not the simulated one.
- **A transaction simulator.** That's a sibling product
  (`@ethernauta/simulation`, planned). The two share anvil
  lifecycle infrastructure but answer different questions: a
  test harness asks "did this pass?", a simulator asks "what
  would this do?".
- **A signer.** The library doesn't ship a custom signer
  adapter; anvil signs natively for accounts derived from its
  mnemonic, and `create_provider` from
  `@ethernauta/transport` adapts the 1193 envelope into the
  resolver pair — same call shape as production's
  `create_provider(window.ethereum)`.
