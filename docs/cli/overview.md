---
title: "@ethernauta/cli"
section: Overview
section_order: 7
order: 11
---

# @ethernauta/cli

The `ethernauta` command-line tool. Two subcommands today, both for code generation:

- `ethernauta abi` — generate TypeScript method bindings from a contract ABI.
- `ethernauta registry` — walk a directory of ABIs and emit a 4-byte selector registry.

```bash
pnpm dlx @ethernauta/cli --help
```

## `ethernauta abi`

Generate one TypeScript file per ABI method.

```bash
ethernauta abi --in ./erc20.abi.json --out ./generated/
```

**Inputs:** A JSON ABI (Solidity artifact or bare ABI array).

**Outputs:** One `.ts` per method, kebab-cased filename (`balance-of.ts`, `transfer-from.ts`). Each file exports a curried method returning `Callable<T>` (for reads) or `Signable<Hash32>` (for writes).

The generator preserves ABI casing in the **signature string** used for selector computation (`balanceOf(address)`, `transferFrom(address,address,uint256)`) while the TS function names follow the project's snake_case convention (`balance_of`, `transfer_from`).

## `ethernauta registry`

Walk a directory of ABIs and produce a selector → metadata mapping.

```bash
ethernauta registry --in ./packages/erc/src --out ./packages/erc/src/registry.ts
```

**Inputs:** A directory containing ABI fragment files (per-method TypeScript files, as produced by `ethernauta abi`).

**Outputs:** A single TypeScript file exporting `REGISTRY: Record<Bytes4, MethodMetadata>`.

Used internally by `pnpm --filter @ethernauta/erc generate` to keep `@ethernauta/erc/registry` synced with the per-ERC method files.

## Programmatic API

The CLI's command handlers are also exported as functions for embedding in other tooling:

```ts
import { execute_abi, execute_registry } from "@ethernauta/cli";

await execute_abi({ input: "./foo.abi.json", output: "./generated/" });
await execute_registry({ input: "./packages/erc/src", output: "./registry.ts" });
```

## Adding a new generator

Each subcommand lives at `packages/cli/src/commands/<name>/`. To add a new generator, follow the existing shape:

1. Author the command module under `packages/cli/src/commands/<name>/`.
2. Wire it into the CLI entry in `packages/cli/src/index.ts`.
3. Export an `execute_<name>` function so consumers can call it directly.

## See also

- [Tooling → ERC codegen](/tooling/erc-codegen) — the typical regeneration workflow.
- [Tooling → adding a new standard](/tooling/adding-a-standard) — when codegen isn't enough.
- [@ethernauta/abi → generator](/abi/overview) — the lower-level codegen primitives.
