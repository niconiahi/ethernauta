# @ethernauta/testing

Vitest-first testing utility for `@ethernauta/*` consumers. Spawns
a local anvil node per worker, exposes its endpoint as a transport
compatible with `http(...)`, and runs default-on snapshot/revert
isolation around each test.

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
import { http, create_reader } from "@ethernauta/transport"
import { test } from "@ethernauta/testing"

const reader = create_reader([{ chainId, transports: [http(test())] }])
```

Full docs land in Phase 8.

## Subpaths

| Subpath | Exports |
|---|---|
| `@ethernauta/testing` | `test()`, account helpers, lifecycle types |
| `@ethernauta/testing/vitest` | `ethernautaAnvil()` vitest plugin |
| `@ethernauta/testing/anvil` | Anvil RPC method bindings (`evm_*`, `anvil_*`) |
