---
name: conventions
description: The single non-negotiable typing convention of this monorepo — types are derived from Valibot schemas with v.InferOutput. Never write hand-rolled interfaces or object types. Read this before declaring any new type anywhere in @ethernauta/*.
---

# Conventions — Valibot-first typing

This document is one rule and a small set of corollaries. The rule binds across every package in the workspace.

## The rule

> **At any boundary that carries a value, declare a Valibot schema first, then derive the TypeScript type from it.**

A boundary is anywhere a value crosses a trust line: function parameters, function returns, JSON-RPC envelopes, `chrome.runtime` messages, `window.postMessage` payloads, IndexedDB records, view-model state, signal payloads. If the value has shape, the shape lives in a schema and the type comes out of the schema.

We do this because the schema is the *only* place where the runtime contract and the compile-time contract agree. A hand-written `interface` makes a claim about the data that the runtime cannot enforce; one drift later and the claim is a lie. The schema, by contrast, is checked at the boundary with `parse` — if the value gets past, the type is honest.

## The pattern, in two lines

```ts
import { type InferOutput, object, string } from "valibot"

export const personSchema = object({ name: string() })
export type Person = InferOutput<typeof personSchema>
```

That is the entire convention. Everything below is a corollary.

## Naming

- Schema: lowerCamelCase + `Schema` suffix — `addressSchema`, `verifyHashParametersSchema`, `typedDataDomainSchema`. (See `packages/core/src/address.ts:10`, `packages/eip/src/1271/verify-hash.ts:33`, `packages/eip/src/712/typed-data.ts:21`.)
- Type: PascalCase, no suffix — `Address`, `VerifyHashParameters`, `TypedDataDomain`.
- Both go in the same file, schema first, type immediately below. Both are exported unless the schema is intentionally private to the module.
- When the schema is the canonical reference for a wire-level shape (Chrome message, JSON-RPC request/response), the convention is PascalCase + `Schema` — see `packages/wallet/src/utils/event.ts:18` (`SignTransactionRequestSchema`). Pick one style per file; do not mix.

## Naming — no abbreviations

Identifier names are spelled in full. Use `transaction_hash`, not `tx_hash`. Use `transactions`, not `txs`. Use `parameters`, not `params`. Use `request`, not `req`. Use `operation`, not `op`. The cost of typing the full word is paid once; the cost of decoding the abbreviation is paid by every future reader.

Wire-level identifiers dictated by an external standard are exempt — JSON-RPC method names (`eth_sendRawTransaction`), ABI-bound function names (`balanceOf`, `transferFrom`), and EIP-spec field names (`chainId`, `gasLimit`, `params` at the JSON-RPC envelope layer) must match the spec verbatim regardless of casing or abbreviation. The exemption is for the wire boundary only; once a value has been `parse`d into a domain type, give the destination field its full name.

## Forbidden constructs

- `interface Foo { ... }` — never. Use `object({ ... })` + `InferOutput`.
- `type Foo = { ... }` declared by hand — never, when the value will be validated, stored, sent, or returned across a boundary.
- `as Foo` casts that bypass schema validation — never, when the data comes from outside the function (RPC, message, storage, user input).
- `safeParse` to swallow errors — never. `parse` throws. Surface the error or let it bubble.

## Where hand-written types are still tolerated

The rule is about **value-bearing boundaries**. There are three narrow places where a hand-written type is still acceptable:

1. **Generic transport shapes that have no value of their own.** `Readable<T>`, `Writable<T>`, `Signable<T>`, `Callable<T>`, `ResolvedReader`, `ContractContext`, `RlpInput` — these are function-shape contracts and execution capabilities, not data shapes. There is nothing to validate. A schema would be meaningless.
2. **Local intra-function aliases** that exist only to avoid retyping a long generic at one call site, and that never escape the module. These should be rare and small.
3. **Re-exporting an upstream library's type** so consumers do not depend on the library directly (e.g. wrapping `HDKey` from `@scure/bip32`).

If a "type" you are about to write describes the *content* of a value — its fields, its variants, its possible string values — it is a value-bearing boundary and must go through Valibot. No exceptions.

## Parsing at the boundary

Validation is the back half of the convention. The schema is useless if its `parse` is not called.

Idiom — the function accepts an *underscore-prefixed* loose parameter, immediately validates, and uses the validated value from that line on. From `packages/erc/src/20/methods/transfer.ts:36-47`:

```ts
export function transfer(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([signer, _context]: ResolvedSigner) => {
    if (!_context.to) throw new Error(...)
    const parameters = parse(parametersSchema, _parameters)
    // from here on, only `parameters` is used
    ...
  }
}
```

The `_` prefix is the signal: "this value has not yet been validated; do not use it". Once `parse` returns, drop the prefix. Match this idiom whenever the entry into a function is a value-bearing boundary.

## The union trick for two-shape inputs

When a method accepts both a positional tuple and a named object (a recurring pattern — see `@ethernauta/erc/20`, `@ethernauta/erc/137`), the schema is a `union` of `tuple` and `object`, and the type comes out automatically:

```ts
// packages/erc/src/20/methods/transfer.ts:30-34
const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({ to: addressSchema, value: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>
```

Inside the function body, `Array.isArray(parameters)` discriminates the two cases — TypeScript narrows correctly because the union came from the schema.

## Composition over redefinition

Schemas compose. If you need to type `{ id, request }`, do not define a new `string` schema for `id` — import `string()` from valibot and the relevant request schema from where it already lives. If you need an address, do not redeclare the regex — import `addressSchema` from `@ethernauta/core`. The reuse rule is: the schema is declared **once**, at the lowest package in the dependency graph that needs it, and every consumer above it imports it.

This is also why `core` exists. Read `skills/core/SKILL.md`.

## Signals and reactive state

Reactive state (`@preact/signals`) is no exception. The signal's payload is a value-bearing boundary — declare the schema, derive the type, type the signal with that type. From `packages/wallet/src/utils/transaction.ts:14-27`:

```ts
export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: parametersSchema,
  to: optional(string()),
})
export type Transaction = InferOutput<typeof TransactionSchema>
export const transaction_request = signal<Transaction>({
  id: "some-id",
  method: "hello_world",
  params: [],
})
```

## Adding a new typed boundary — checklist

When you are about to introduce a new function, message, or storage record:

1. Identify the value-bearing boundaries (params in, value out, anything stored or sent).
2. For each boundary, write or import a Valibot schema. Compose from `@ethernauta/core` primitives where possible.
3. Derive the type with `InferOutput`.
4. At the function entry, `parse` the boundary value.
5. Never reach for `interface` or hand-rolled `type` to describe the shape. The schema is the type.

If you find yourself writing an `interface`, stop. Either the value is a true generic capability (one of the three tolerated cases above) — in which case carry on — or it belongs in a Valibot schema and you are about to add drift to the codebase. Choose the schema.
