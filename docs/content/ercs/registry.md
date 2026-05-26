---
title: Selector registry
section: ERCs
section_order: 5
order: 19
---

# `@ethernauta/erc/registry`

A 4-byte selector → method metadata mapping covering every ERC method shipped by `@ethernauta/erc`. **Auto-generated** by `pnpm --filter @ethernauta/erc generate`.

```ts
import { REGISTRY } from "@ethernauta/erc/registry";

REGISTRY["0xa9059cbb"];
// → {
//   name: "transfer",
//   signature: "transfer(address,uint256)",
//   inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
//   erc: 20,
// }
```

## What it's for

**Decoding unknown calldata.** When the wallet's `send-calls` view receives a batch of `{ to, data }` items, it slices the first 4 bytes of each `data` and looks up the registry to produce human-readable method names.

**Audit-friendly logs.** Dapps that surface "you just submitted a transfer + a swap" can label each leg without bundling per-contract ABIs.

**Generic transaction parsers.** Tooling that has to handle "any ERC method" can ship the registry instead of every ABI.

## Surface

| Export | Purpose |
|---|---|
| `REGISTRY` | `Record<Bytes4, MethodMetadata>` — frozen at generation time. |

## How it's generated

`pnpm --filter @ethernauta/erc generate` walks `packages/erc/src/<n>/methods/` and extension subfolders, collects every method's ABI fragment, computes `keccak(signature)`, and emits the registry as a single TypeScript constant.

The generator lives in `@ethernauta/cli` as the `ethernauta registry` subcommand. Run it after adding a new ERC method or modifying an existing one.

## See also

- [Tooling → ERC codegen](/tooling/erc-codegen) — full regeneration flow.
- [@ethernauta/abi → to_selector](/abi/overview) — the selector hash function.
- [@ethernauta/cli](/cli/overview) — the codegen command.
