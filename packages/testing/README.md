# @ethernauta/testing

Vitest-first testing utility for `@ethernauta/*` consumers. Spawns
a local anvil node per worker, exposes its endpoint as a URL that
both `http(...)` (path 2) and `create_provider(...)` (path 1)
accept, and runs default-on snapshot/revert isolation around each
test.

## Install

```bash
pnpm add -D @ethernauta/testing
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

## Two-files-total usage

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"
import { ethernautaAnvil } from "@ethernauta/testing/vitest"

export default defineConfig({ plugins: [ethernautaAnvil()] })
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

// path 2 (no wallet)
const reader = create_reader([
  { chainId: "eip155:31337", transports: [http(anvil())] },
])

// path 1 (wallet-shape) — same shape as production's
// `create_provider(window.ethereum)`; only the provider source differs.
const resolver = create_provider(create_testing_provider(anvil()))
const account = anvil_account(0)
```

Full docs land in Phase 8.

## Subpaths

| Subpath | Exports |
|---|---|
| `@ethernauta/testing` | `anvil()`, account helpers, lifecycle types |
| `@ethernauta/testing/vitest` | `ethernautaAnvil()` vitest plugin, `without_isolation()` |
| `@ethernauta/testing/anvil` | Anvil RPC method bindings (`evm_*`, `anvil_*`) |
