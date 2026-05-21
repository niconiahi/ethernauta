---
name: utils
description: Catalog of @ethernauta/utils and the decision rubric for "does this function belong in utils, or colocated with its caller?". Read this before adding a new helper function anywhere in the workspace.
---

# Utilities — @ethernauta/utils

`@ethernauta/utils` is the bottom-most behavioral package — pure, dependency-free (`packages/utils/package.json:29-32` only depends on `chain` and `transport`, neither of which the actual helpers use), and it must stay that way. Everything here is a small, well-named, side-effect-free function. No I/O. No DOM. No wallet. No RPC.

If a helper has side effects, talks to the network, talks to storage, depends on Preact or signals, or carries business meaning specific to one package — it does **not** belong here.

## The catalog

All entries re-exported from `packages/utils/src/index.ts`. Import via `@ethernauta/utils`.

### Hex ↔ bytes ↔ numbers

| Function | Signature | What |
|---|---|---|
| `bytes_to_hex` | `(data: Uint8Array) => "0x${string}"` | Lowercase hex with `0x` prefix. Allocation-free table lookup |
| `hex_to_bytes` | `(hex: string) => Uint8Array` | Throws on odd length or invalid char. Accepts with or without `0x` |
| `hex_to_number` | `(hex: "0x${string}") => number` | Thin `Number(hex)`. Use only for small quantities |
| `number_to_hex` | `(n: number) => "0x${string}"` | Lowercase, no padding |
| `strip_hex_prefix` | `(hex: string) => string` | Removes `0x` if present, returns input otherwise |

### Units

| Function | Signature | What |
|---|---|---|
| `format_unit` | `(value: bigint, decimals?: number) => string` | bigint → decimal string. `decimals` defaults to 18 (wei → ether). Strips trailing zeros |
| `parse_unit` | `(value: string, decimals?: number) => bigint` | Inverse. Throws on empty/invalid input or too many fractional digits |

### Time

| Function | Signature | What |
|---|---|---|
| `seconds_to_big` | `(seconds: number) => bigint` | Floor + BigInt |
| `now_to_big` | `() => bigint` | Unix epoch seconds as bigint |
| `deadline_in` | `(seconds: number) => bigint` | `now + seconds` as bigint. Useful for EIP-2612 / permit deadlines |

### RLP

| Function | Signature | What |
|---|---|---|
| `rlp_encode` | `(input: RlpInput) => Uint8Array` | Recursive Length Prefix encoder. `RlpInput = string \| number \| bigint \| Uint8Array \| RlpInput[]`. The exported `type RlpInput` is one of the tolerated hand-written types — it is a generic-shape variant, not a value-bearing boundary (see `skills/conventions/SKILL.md`) |

### Assertions

| Function | Signature | What |
|---|---|---|
| `invariant` | `(condition: unknown, message: string) => asserts condition` | Throws `Error("message: ${message}")` if falsy. TypeScript narrows after the call |

### String

| Function | Signature | What |
|---|---|---|
| `camel_to_kebab` | `(input: string) => string` | `someThingHere` → `some-thing-here`. Handles acronyms (`HTTPServer` → `http-server`) |

## When a helper belongs in `@ethernauta/utils`

All of these must be true:

1. **Pure.** No I/O, no DOM, no storage, no clock-state (`now_to_big` is the boundary case — it reads `Date.now`, but it produces a value with no observed mutation).
2. **No external dependencies beyond `node:` builtins and `valibot`.** Anything else broadens the dependency surface of every consumer.
3. **Reused by at least two packages.** If only one package consumes it, colocate.
4. **Domain-agnostic.** "Helper for ENS labelhashing" is ENS-specific — it belongs in `@ethernauta/erc/137`, not here. "Hex ↔ bytes" is universal — it belongs here.
5. **Named in `snake_case` for functions** (project-wide style — see `biome.json`).
6. **Side-effect-free at module scope.** No top-level `console.log`, no `globalThis` writes, no caches that grow forever.

If any one is false, it does not belong in utils.

## When a helper belongs colocated (next to its caller)

Default to colocation. The decision rubric:

- **Used by one package only.** Put it in that package — `packages/<pkg>/src/utils/<helper>.ts` for package-private helpers, or directly next to the feature file.
- **Has domain meaning.** `compose_capabilities` (`packages/wallet/src/utils/calls-status.ts`) is wallet-specific. `namehash` (`packages/erc/src/137/namehash.ts`) is ENS-specific. They live where they belong.
- **Depends on package-specific imports.** A helper that imports `@preact/signals`, `chrome.runtime`, or anything Chrome-extension-shaped cannot live in `@ethernauta/utils`.
- **Tightly coupled to a single function.** If the helper is only ever called from one site, inline it or keep it private in the same file. Three similar lines is better than a premature abstraction.

Worked examples of correct colocation already in the codebase:

- `compose_key` (one-line `pending_${id}` helper) is **inlined** in `packages/wallet/manifest/extension.entry.ts:15-17`. Correct — single call site.
- `is_authenticated` lives in `packages/wallet/src/utils/authentication.ts`. Correct — wallet-specific, reads `chrome.storage`.
- `parse_signature` is **private** inside `packages/eip/src/1271/recover.ts:18-46`. Correct — only `recover_address` uses it.
- `this_directory` lives in `packages/erc/src/utils/this-directory.ts`. Correct — it imports `node:url` and is only used by ERC scripts.
- `format_unit` / `parse_unit` live in `@ethernauta/utils`. Correct — every package that surfaces token balances uses them.

## Decision flowchart

```
You are about to write a function. Ask, in order:

1. Is this function used in only one file?
   → YES: write it in that file (private, not exported). Stop.

2. Is this function used in only one package?
   → YES: put it under packages/<pkg>/src/utils/<helper>.ts.
          Export from that package's internal surface only. Stop.

3. Does it depend on package-specific code (signals, chrome.*, RPC,
   storage, anything stateful or environmental)?
   → YES: it must be colocated. Pick a package and put it there. Stop.

4. Is it pure, dependency-free, used by 2+ packages, and
   domain-agnostic?
   → YES: it belongs in @ethernauta/utils.
          Add the file in packages/utils/src/<name>.ts.
          Re-export from packages/utils/src/index.ts.
          Co-locate a *.test.ts.

5. Otherwise — you are probably about to over-abstract. Inline it.
```

## Adding to `@ethernauta/utils` — checklist

1. **Create the file.** `packages/utils/src/<kebab-name>.ts`. One concept per file.
2. **`snake_case` function name.** Match the rest of the package.
3. **Co-locate a test.** `<kebab-name>.test.ts` next to the source. See `packages/utils/src/unit.test.ts`, `time.test.ts`, `rlp.test.ts` for the established Vitest pattern.
4. **Re-export from `index.ts`.** Single line: `export * from "./<kebab-name>"`.
5. **Document only the WHY.** A one-line top-of-file comment for non-obvious helpers (see `packages/utils/src/rlp.ts:1-3`). Otherwise, no comments — names carry the meaning.
6. **No new dependencies.** If you would need to add an npm package to write the helper, it does not belong here.

## Pitfalls

- **Don't add wrappers that hide the standard library.** `seconds_to_big(n)` exists because the `BigInt(Math.floor(n))` idiom shows up many times. A single-call-site wrapper would not.
- **Don't add format helpers for one specific UI need.** Token-amount rounding for a particular view goes in that view; `format_unit` is the universal primitive.
- **Don't put schemas here.** Valibot schemas at boundaries belong with the feature that owns the boundary, and primitive schemas belong in `@ethernauta/core`. `@ethernauta/utils` has *behavior*, not *shape*.
- **Don't put EIP / ERC helpers here.** Even if pure (e.g. `namehash`, `rlp_encode_transaction`), if the helper exists *because* of a specific standard, put it next to that standard. The exception in the catalog is `rlp_encode` itself — pure RLP, no Ethereum-transaction shape — which is general enough to live here.
