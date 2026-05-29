---
name: eip
description: Guidelines for adding a new Ethereum Improvement Proposal under packages/eip. Read this before introducing a new EIP-<n>/ folder so the structure, imports, schemas, and tests match the rest of the package.
---

# Adding an EIP — @ethernauta/eip

`@ethernauta/eip` ships implementations of EIPs that are **not** part of the base JSON-RPC surface (those live in `@ethernauta/eth`). Each EIP lives in its own subpath so consumers only pay for what they import; the `exports` map in `packages/eip/package.json:14-19` is `"./*": "./dist/*/index.js"`, so adding a new EIP under `packages/eip/src/<n>/` automatically becomes importable as `@ethernauta/eip/<n>`.

Currently shipped: `191`, `712`, `1014`, `1102`, `1167`, `1193`, `1271`, `1967`, `2255`, `3085`, `3326`, `3668`, `4337`, `4361`, `5267`, `5792`, `6492`, `6963`, `7702`.

## The ownership rule — non-negotiable

**If a helper, schema, constant, or method exists *because* of EIP-`<n>`, it lives in `packages/eip/src/<n>/`. No exceptions.**

This is the same rule the ERC package follows (`@ethernauta/erc/20` owns `transfer`, `balance-of`, `transfer-from`, etc. — they exist because of ERC-20). EIPs are no different.

Concrete instances of the rule:

- EIP-1014 defines CREATE2. Therefore `get_create2_address` lives in `packages/eip/src/1014/`. The CREATE-address sibling (`get_contract_address`) ships next to it — they are a derivation pair, both exist for the same reason. The `deploy_contract` helper that produces creation calldata also lives here: it exists *because* CREATE/CREATE2 exist, and any consumer reaching for `get_create2_address` is one step away from also needing the creation tx.
- EIP-1271 owns `verify_hash`, `verify_message`, `verify_typed_data`, and the `MAGIC_VALUE` constant.
- EIP-6492 owns `wrap_signature`, `unwrap_signature`, `is_6492_signature` — even though "wrap a signature" sounds generic, the wrapping format itself is what 6492 specifies.

If you find yourself about to put a helper in `@ethernauta/transport`, `@ethernauta/utils`, `@ethernauta/eth`, or `@ethernauta/abi` **because** an EIP says so — stop. It belongs in the EIP folder. The only carve-outs are:

1. **Truly cross-cutting primitives that pre-date any EIP**: ABI codec leaves (`address`, `uint256`, …) in `@ethernauta/abi`; `keccak_256` from `@noble/hashes`; RLP encoding in `@ethernauta/utils`. These exist regardless of any particular EIP and are imported *by* the EIP folder.
2. **Wire envelopes shared by the wallet/transport plumbing** (`CallSchema`, `ParametersSchema`, the four method shapes). These are infrastructure, not standard semantics.

The smell test: "would this helper still exist if EIP-`<n>` were deleted from the universe?" If no, it belongs in `packages/eip/src/<n>/`.

## Folder shape

Every EIP folder follows the same shape. Use existing ones as templates — `1271` and `6492` are the most complete examples.

```
packages/eip/src/<n>/
  index.ts                   # re-exports the public surface
  <primitive>.ts             # one file per primitive (constants, magic values, predicates)
  <operation>.ts             # one file per operation (verify_*, recover_*, build_*)
  <operation>.test.ts        # co-located vitest for that operation
  method/                    # OPTIONAL — JSON-RPC method wrappers (Signable<T>)
    <eth_method>.ts          #   e.g. method/eth_requestAccounts.ts
```

Rules:

- **One operation per file.** `verify-hash.ts`, `verify-message.ts`, `verify-typed-data.ts` are three files, not one. This is the granularity at which tree-shaking works.
- **Filenames in kebab-case.** `wrap-signature.ts`, `magic-value.ts`. Inside the file, identifiers are `snake_case` for functions and `camelCase` for schemas (`VerifyHashParametersSchema`).
- **Tests are co-located.** `verify-hash.ts` next to `verify-hash.test.ts`. Vitest discovers them via `vitest.config.mjs`.
- **The first line of every file is a link to the spec.** `// https://eips.ethereum.org/EIPS/eip-<n>` — see `packages/eip/src/1271/recover.ts:1` and `packages/eip/src/6492/index.ts:1`. If your operation is half from one EIP and half from another (e.g. `recover.ts` cites both 1271 and 2098), list both.

## `index.ts` — the public surface

`index.ts` is a curated re-export list. Anything not named here is a private implementation detail and consumers should not import it. From `packages/eip/src/1271/index.ts`:

```ts
// https://eips.ethereum.org/EIPS/eip-1271

export { MAGIC_VALUE } from "./magic-value"
export { recover_address } from "./recover"
export { verify_hash } from "./verify-hash"
export { verify_message } from "./verify-message"
export { verify_typed_data } from "./verify-typed-data"
```

Re-export shape:

- `export { ... } from "./<file>"` — named, never `export *` for individual files (it makes the public surface invisible at a glance).
- Re-export schemas and their derived types only when consumers need them at the boundary (e.g. `VerifyHashParameters` is used by `@ethernauta/wallet`). If a schema is only used internally, do not export it from `index.ts`.

## Method wrappers (the `method/` subfolder)

When the EIP defines a JSON-RPC method that the dapp will call through the signer (e.g. EIP-1102 `eth_requestAccounts`, EIP-712 `eth_signTypedData_v4`), put it under `method/<eth_methodName>.ts` and re-export from `index.ts`. The method is a `Signable<T>` — see `skills/ethernauta/SKILL.md` for the method shapes.

From `packages/eip/src/1102/method/eth_requestAccounts.ts`:

```ts
// https://eips.ethereum.org/EIPS/eip-1102
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"

export function eth_requestAccounts(): Signable<string[]> {
  return ([signer, _context]: ResolvedSigner) =>
    signer("eth_requestAccounts", undefined).then(
      (result) => JSON.parse(result),
    )
}
```

Method functions are **curried**. The outer call validates parameters; the inner call accepts the resolved tuple and executes. Never collapse the two.

## Schemas first, types from `InferOutput`

This is the project-wide convention (`skills/conventions/SKILL.md`). Inside an EIP, every value-bearing boundary is a Valibot schema composed from `@ethernauta/core` primitives. From `packages/eip/src/1271/verify-hash.ts:33-40`:

```ts
import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
} from "@ethernauta/core"
import { type InferOutput, object, parse } from "valibot"

export const VerifyHashParametersSchema = object({
  address: AddressSchema,
  hash: Hash32Schema,
  signature: BytesSchema,
})
export type VerifyHashParameters = InferOutput<
  typeof VerifyHashParametersSchema
>
```

And the entry-point pattern — accept `_parameters` (loose), `parse` immediately, use `parameters` (validated) from there on:

```ts
export function verify_hash(
  _parameters: VerifyHashParameters,
): Readable<boolean> {
  return async ([transports, _context]: ResolvedReader) => {
    const parameters = parse(VerifyHashParametersSchema, _parameters)
    ...
  }
}
```

If you find yourself writing `interface` or hand-rolled `type X = { ... }`, stop and read `skills/conventions/SKILL.md`. There is one narrow exception inside this package: pure shape aliases like `UnwrappedSignature` in `6492/unwrap-signature.ts` are tolerated because the value is never deserialized from the wire — it is produced by code that already validated its inputs. When in doubt, prefer the schema.

## Choosing the method shape

An EIP operation returns one of the four shapes defined by `@ethernauta/transport` (see `skills/ethernauta/SKILL.md` for the table):

- **`Readable<T>`** — needs RPC reads but no wallet. The signer is not involved. Most verification operations are `Readable` because the contract-1271 fallback needs `eth_call`. See `verify_hash` in `packages/eip/src/1271/verify-hash.ts`.
- **`Writable<T>`** — submits a raw transaction. Currently no EIP in the package uses this directly; broadcasting is `eth_sendRawTransaction` in `@ethernauta/eth`.
- **`Signable<T>`** — needs the wallet. JSON-RPC methods that delegate to the user's wallet (`eth_requestAccounts`, `eth_signTypedData_v4`, `personal_sign`, `wallet_addEthereumChain`, `wallet_sendCalls`, `wallet_sendSetCodeTransaction`).
- **`Callable<T>`** — read-only contract method. EIPs don't usually expose `Callable` at the top level; that's ERC territory. But internal helpers can produce calldata + decoder pairs.

If the operation is pure (e.g. `recover_address`, `namehash`, `wrap_signature`, `unwrap_signature`), don't wrap it in a method shape — just export it as a plain function. The method shapes are for things that need a resolved transport, not for pure crypto.

## Testing

- **One test file per operation.** Co-located.
- **Use `parse` against your own schema in tests when constructing inputs from string literals** — this catches regex drift between the spec and your schema.
- **Mock the transport, not the entire signer protocol.** For `Readable`, `Writable`, `Callable`: hand the function a fake `transports` array of functions that return canned responses. For `Signable`: hand it a fake `signer` function that returns canned JSON strings. See `packages/eip/src/1271/verify-hash.test.ts` for the pattern.

## Step-by-step — adding `eip-<n>`

1. **Read the EIP.** Identify the discrete operations. Write each one's name down. Note which need RPC, which need the wallet, which are pure.
2. **Create the folder.** `mkdir packages/eip/src/<n>`. Add `index.ts` (initially empty).
3. **For each schema-bearing input/output**, declare a Valibot schema. Reuse `@ethernauta/core` primitives. Derive types with `InferOutput`. Co-locate the schema in the file that uses it, unless two files share it — then promote it to a sibling file (e.g. `parameters.ts`) and import.
4. **For each operation**, write the function in its own file, prefixed comment with the spec link. Use the canonical entry pattern: `_param` → `parse` → `param`.
5. **For each operation**, write a co-located `*.test.ts`. Cover spec vectors if the EIP provides them.
6. **Curate `index.ts`.** Re-export only what consumers need.
7. **Update the EIP package README** (`packages/eip/README.md`) — add the EIP to the "Currently supports" list and add a short API snippet.
8. **No package.json edits needed** for the new subpath — the `./*` exports map covers it. Build once (`pnpm --filter @ethernauta/eip build`) and verify `dist/<n>/index.js` exists.

## Cross-package imports — what you can and cannot import

EIPs are a middle layer. Permitted imports:

- `@ethernauta/core` — primitive schemas (always allowed).
- `@ethernauta/utils` — pure utilities (`bytes_to_hex`, `hex_to_bytes`, `number_to_hex`, `rlp_encode`).
- `@ethernauta/transport` — `Readable`, `Writable`, `Signable`, `Callable`, `ResolvedReader`, `ResolvedSigner`, `ResolvedContract`, `CallSchema`, `ParametersSchema`.
- `@ethernauta/abi` — only when the EIP requires ABI encode/decode (e.g. `6492` decodes `(address, bytes, bytes)`).
- `@noble/hashes`, `@noble/secp256k1` — pure crypto.
- Other `@ethernauta/eip/<m>` subpaths — fine when one EIP genuinely builds on another (see `1271/verify-message.ts` importing `../191/personal-message`).
- `valibot` — peer dep.

Forbidden imports:

- `@ethernauta/wallet` — the wallet depends on EIPs, never the other way around.
- `@ethernauta/erc` — same; ERCs are consumers.
- `@ethernauta/ens` — same.
- DOM-only globals (`window`, `document`) — EIP code must run in the wallet popup, in the service worker, and in dapp code. Use `globalThis` if you really need a runtime branch.
