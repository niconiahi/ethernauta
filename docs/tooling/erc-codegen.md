---
title: ERC codegen
section: Tooling
section_order: 4
order: 1
---

# Regenerating the ERC method bindings

`@ethernauta/erc` ships hundreds of method files — `packages/erc/src/20/methods/transfer.ts`, `packages/erc/src/721/methods/owner-of.ts`, and so on for every ERC. Almost all of them are **auto-generated** from a canonical ABI per ERC. So is `@ethernauta/erc/registry` — the selector → metadata mapping.

When you:

- Add a new ERC.
- Add a method to an existing ERC.
- Change a method's signature.

…you regenerate. One command.

## The command

```bash
pnpm --filter @ethernauta/erc generate
```

What it does:

1. For each `packages/erc/src/<n>/` folder, reads the canonical ABI file (typically `abi.json` at the folder root or `abi/<name>.json` for extensions).
2. Runs `ethernauta abi --in <abi> --out <methods/>` to emit one TypeScript file per method.
3. Walks the full `packages/erc/src/` tree and runs `ethernauta registry --in . --out registry.ts` to produce the selector mapping.
4. Formats with Biome.

The output should produce a clean diff that you commit alongside any spec change.

## Per-ERC layout

Each generated `packages/erc/src/<n>/methods/<method>.ts` follows this shape:

```ts
// auto-generated — do not edit
import { make_codec, parse_abi } from "@ethernauta/abi";
import type { Callable } from "@ethernauta/transport";
import { addressSchema, uint256Schema } from "@ethernauta/core";

const fragment = parse_abi(["function transfer(address to, uint256 amount) returns (bool)"])[0];
const codec = make_codec(fragment);

export const transfer = (args: { to: Address; amount: Uint256 }): Signable<Hash32> => {
  // ...
};
```

ABI-bound identifiers preserve their **ABI casing** (`balanceOf`, `transferFrom`) inside the signature string so `keccak(signature)` matches the on-chain 4-byte selector. The exported TypeScript function name follows the project's snake_case convention.

## Don't hand-edit generated files

The header `// auto-generated — do not edit` is the cue. If you need to change a generated file:

1. Change the canonical ABI input.
2. Regenerate.
3. Commit both.

Hand edits will be silently clobbered on the next regeneration.

## The registry

`@ethernauta/erc/registry` is regenerated as part of the same command. It walks every ERC method file and emits:

```ts
export const REGISTRY = {
  "0xa9059cbb": {
    name: "transfer",
    signature: "transfer(address,uint256)",
    inputs: [...],
    erc: 20,
  },
  // ...
};
```

Consumers (the wallet's `send-calls` view, audit-friendly logs) look up selectors here without bundling per-contract ABIs.

## Adding a new ERC

If the new standard fits the canonical-ABI model — i.e. it's a normal contract interface — you place its ABI under `packages/erc/src/<n>/abi.json` and regenerate. The generator handles the rest.

If it doesn't fit (e.g. helpers like ENSIP-15 normalization, or cross-method primitives like ERC-5564 stealth-key derivation), you hand-author files in the same folder and the generator skips them.

See [Tooling → adding a new standard](/tooling/adding-a-standard) for the full template.

## See also

- [@ethernauta/cli](/cli/overview) — the `abi` + `registry` subcommands.
- [@ethernauta/abi → generator](/abi/overview) — the lower-level codegen primitives.
- [@ethernauta/erc → registry](/ercs/registry) — what the registry contains.
