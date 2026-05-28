---
title: Folder-shaped standards
section: Concepts
section_order: 2
order: 6
---

# Folder-shaped standards

Hard rule 11 in CLAUDE.md: **anything implementing a numbered standard lives in `packages/eip/src/<n>/` or `packages/erc/src/<n>/`**. The folder name is the standard number. No exceptions.

Even small helpers — if their behavior is defined by a numbered standard, they belong in the matching folder, not scattered into `@ethernauta/abi`, `@ethernauta/utils`, or anywhere else.

## What a standard folder looks like

`packages/eip/src/712/`:

```
712/
  index.ts                ← spec link comment, re-exports public surface
  schemas/
    typed-data.ts         ← Valibot schemas
  utils/
    hash-typed-data.ts    ← digest composition
    sign-typed-data.ts    ← signer
  methods/
    eth-sign-typed-data-v4.ts   ← the eth_signTypedData_v4 method binding
```

The `index.ts` carries the spec link and the public re-exports:

```ts
// https://eips.ethereum.org/EIPS/eip-712
export { TypedDataSchema, type TypedData } from "./schemas/typed-data";
export { hash_typed_data } from "./utils/hash-typed-data";
export { sign_typed_data } from "./utils/sign-typed-data";
```

`packages/eip/package.json` declares each subpath as an export, so `@ethernauta/eip/712` imports it.

## Why it matters

**No archaeology.** When you're investigating a bug in typed-data signing, the only place you look is `packages/eip/src/712/`. You don't grep across `utils/` and `abi/` and the wallet to find scattered pieces.

**Atomic upgrades.** When EIP-7702's authorization tuple shape changes during the draft phase (it did, several times), one folder is the entire change surface. The folder gets opened, the schemas update, the methods recompose. The PR is bounded.

**Folder + done.** Adding a new EIP is a `mkdir` + populate operation, by design. The shape of the folder is the rubric for "is this a complete implementation."

**Spec linkability.** Every folder's `index.ts` opens with the spec URL as a top comment. Readers go from code → spec in one click. The reverse (spec → code) is just `packages/eip/src/<n>/`.

## What does NOT go in a numbered folder

Helpers whose definition is **not** spec-defined. Examples:

- Hex / bytes conversion → `@ethernauta/utils`.
- Generic ABI codec primitives → `@ethernauta/abi`.
- Primitive Valibot schemas (`AddressSchema`, `Bytes32Schema`) → `@ethernauta/core`.
- Generic RLP encoding → `@ethernauta/utils`.

The rubric: **could this helper be reused by a future standard that doesn't exist yet?** If yes, it belongs in an un-numbered package. If it only makes sense in the context of one specific spec, it belongs in that spec's folder.

`keccak_256` is shared (un-numbered). `pack_user_operation` is EIP-4337-specific (4337/).

## The matching ERC convention

`packages/erc/src/<n>/` follows the same shape, with one addition: the method bindings often need a contract ABI fragment. The convention:

```
20/
  index.ts
  methods/
    transfer.ts          ← bind ERC-20 transfer(address,uint256)
    balance-of.ts        ← bind ERC-20 balanceOf(address)
    ...
  extensions/
    burnable/            ← optional ERC-20 extension methods
    capped/
    metadata/
    ...
```

ABI-bound identifiers preserve their **ABI casing** (`balanceOf`, `transferFrom`), not the project's snake_case rule, because `keccak(signature)` must match the on-chain selector. The TypeScript function name follows the project convention; the selector source string preserves the ABI form. See `packages/erc/src/20/methods/transfer.ts` for the canonical shape.

## Adding a new standard

The full template lives at [Tooling → Adding a new EIP/ERC](/tooling/adding-a-standard). Short version:

1. `mkdir packages/eip/src/<n>/`
2. Open with the spec link comment.
3. Author the Valibot schemas in `schemas/`, composing primitives from `@ethernauta/core`.
4. Author the method bindings in `methods/`, returning the right resolver shape (`Readable<T>` / `Writable<T>` / `Signable<T>`).
5. Re-export from `index.ts`.
6. Add the subpath to `packages/eip/package.json`'s exports field.
7. Done. No server change, no coordinated rollout.
