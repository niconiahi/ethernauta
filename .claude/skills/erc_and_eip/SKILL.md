---
name: erc_and_eip
description: Patterns to follow when creating a new EIP under packages/eip/src/<n>/ or a new ERC under packages/erc/src/<n>/. Read this before introducing a new standard folder.
---

# ERC and EIP — creation patterns

This document is the full rulebook for adding a new standard to the Ethernauta monorepo. EIPs and ERCs share most rules; the few differences are called out per-section.

## 1. The ownership rule (non-negotiable)

> If a helper, schema, constant, or method exists **because** of EIP-`<n>` or ERC-`<n>`, it lives in `packages/eip/src/<n>/` or `packages/erc/src/<n>/`. No exceptions.

Smell test: "would this helper still exist if EIP/ERC-`<n>` were deleted from the universe?" If no, it belongs in the standard's folder. Concrete instances:

- EIP-1271 owns `verify_hash`, `verify_message`, `verify_typed_data`, and `MAGIC_VALUE`.
- EIP-6492 owns `wrap_signature`, `unwrap_signature`, `is_6492_signature` — even though "wrap a signature" sounds generic, the wrapping format itself is what 6492 specifies.
- ERC-20 owns `transfer`, `balance-of`, `transfer-from`, etc.

If you find yourself about to drop a helper into `@ethernauta/transport`, `@ethernauta/utils`, `@ethernauta/eth`, or `@ethernauta/abi` **because** a standard says so — stop. It belongs in the standard's folder.

### 1.1. Two exceptions

1. **Tiny building blocks that existed before any EIP.** ABI codec leaves (`address`, `uint256`) in `@ethernauta/abi`; `keccak_256` from `@noble/hashes`; RLP encoding in `@ethernauta/utils`. They are imported BY the EIP folder, not owned by it.
2. **Shared wire plumbing the wallet and transport need everywhere.** `CallSchema`, `ParametersSchema`, the four method shapes (`Readable`, `Writable`, `Signable`, `Callable`) stay in `@ethernauta/transport`. Infrastructure, not standard semantics.

### 1.2. Derivation pairs stay together

When two operations are a derivation pair, they live together in the same standard's folder. Example: EIP-1014 defines CREATE2, but `get_create2_address` ships next to its CREATE sibling `get_contract_address` because they are a derivation pair, both exist for the same reason. The `deploy_contract` calldata helper goes there too — anyone reaching for `get_create2_address` is one step away from also needing the creation transaction.

## 2. Folder shapes

### 2.1. EIP

Canonical templates: `packages/eip/src/1271/` (full standard), `packages/eip/src/1102/` (single-method), `packages/eip/src/6492/` (complex helpers).

```
packages/eip/src/<n>/
  index.ts                   # curated public surface
  <operation>.ts             # one file per operation (verify_*, recover_*, build_*)
  <operation>.test.ts        # co-located vitest
  method/                    # OPTIONAL — JSON-RPC method wrappers (Signable<T>)
    <rpc_method>.ts          #   e.g. method/eth_requestAccounts.ts, method/wallet_addEthereumChain.ts (filename = JSON-RPC name exactly)
```

Primitives (constants, magic values, predicates) are **not** their own files. They live next to the operation that uses them. If `MAGIC_VALUE` is consumed by `verify-hash.ts`, declare it inside `verify-hash.ts`. Only promote a primitive to a sibling file if two or more operation files in the same standard folder share it — and even then, the sibling file name reflects what the primitive *is*, not the abstract concept "primitive".

### 2.2. ERC

Canonical templates: `packages/erc/src/20/` (full standard with extensions; `methods/balance-of.ts` for a view method, `methods/transfer.ts` for a state-changing one), `packages/erc/src/165/` (minimal), `packages/erc/src/137/` (helpers alongside methods).

```
packages/erc/src/<n>/
  index.ts                      # public surface — usually `export * from "./methods"`
  IERC<n>.sol                   # reference Solidity source (commented header notes upstream)
  IERC<n>.abi.json              # canonical ABI from the standard
  <n>.test.ts                   # behavioral test against the binding
  methods/
    index.ts                    # re-exports all methods
    <method-name>.ts            # one method per file (camelCase identifier, kebab-case filename)
  extensions/                   # OPTIONAL — for standards with optional extensions (ERC-20, ERC-721)
    <extension>/
      IERC<n><Extension>.abi.json
      methods/
        index.ts
        <method>.ts
```

Re-export an extension from the standard's `index.ts`:

```ts
export * from "./extensions/<extension>/methods"
```

## 3. Granularity — one operation per file

Each operation gets its own file. `verify-hash.ts`, `verify-message.ts`, `verify-typed-data.ts` are three files, not one. Same for ERCs — `transfer.ts`, `balance-of.ts`, `total-supply.ts` are separate.

The reason is twofold:
1. Each file is a logical boundary and grouping — one concept, one place.
2. Tree-shaking works at file granularity, so consumers only pay for what they import.

## 4. Naming

- **Filenames:** kebab-case (`balance-of.ts`, `wrap-signature.ts`, `verify-typed-data.ts`).
- **Function identifiers:** snake_case (`verify_hash`, `recover_address`, `get_create2_address`).
- **Schemas:** PascalCase + `Schema` suffix (`VerifyHashParametersSchema`).
- **Types:** PascalCase, no suffix (`VerifyHashParameters`).
- **ABI-bound identifiers preserve ABI casing.** `balanceOf` exports `balanceOf` (file `balance-of.ts`); `transferFrom` exports `transferFrom` (file `transfer-from.ts`). The on-wire signature must stay matchable for `keccak(signature)`.

## 5. First line of every standards file — spec link

The first line of every file under `packages/eip/src/<n>/` or `packages/erc/src/<n>/` is a comment with the spec link:

```ts
// https://eips.ethereum.org/EIPS/eip-1271
```

If an operation cites multiple standards (e.g. `recover.ts` uses both EIP-1271 and EIP-2098), list both.

## 6. `index.ts` — the curated public surface

`index.ts` is the public surface. Anything not named there is private and consumers should not import it.

- **EIPs and helper-bearing ERCs (like ENS):** use named re-exports. `export { foo } from "./foo"`. Never `export *` for individual operation files — it makes the public surface invisible at a glance.

```ts
// https://eips.ethereum.org/EIPS/eip-1271
export { MAGIC_VALUE } from "./magic-value"
export { recover_address } from "./recover"
export { verify_hash } from "./verify-hash"
export { verify_message } from "./verify-message"
export { verify_typed_data } from "./verify-typed-data"
```

- **ERCs whose entire public API is the generated method list:** `export * from "./methods"` is fine, plus one line per extension.

```ts
export * from "./methods"
export * from "./extensions/burnable/methods"
export * from "./extensions/permit/methods"
```

Re-export schemas only when consumers need them at the boundary (e.g. `VerifyHashParameters` used by `@ethernauta/wallet`). Internal-only schemas stay private.

## 7. Schemas first, types from `InferOutput`

Every value-bearing input/output is a Valibot schema composed from `@ethernauta/core` primitives. The type is derived with `InferOutput`. No hand-rolled `interface` or `type X = { ... }`.

```ts
import { AddressSchema, BytesSchema, Hash32Schema } from "@ethernauta/core"
import { type InferOutput, object, parse } from "valibot"

export const VerifyHashParametersSchema = object({
  address: AddressSchema,
  hash: Hash32Schema,
  signature: BytesSchema,
})
export type VerifyHashParameters = InferOutput<typeof VerifyHashParametersSchema>
```

### 7.1. Parse at entry — the `_` prefix idiom

Accept the loose underscore-prefixed parameter, `parse` it immediately, use the validated value from there on. The `_` prefix is the signal: "this value has not yet been validated, do not use it". Once `parse` returns, drop the prefix.

```ts
export function verify_hash(_parameters: VerifyHashParameters): Readable<boolean> {
  return async ([transports, _context]: ResolvedReader) => {
    const parameters = parse(VerifyHashParametersSchema, _parameters)
    // from here on, only `parameters` is used
  }
}
```

### 7.2. Always `parse`, never `safeParse`

At boundaries, use `parse` (throws on invalid input). Never `safeParse` to swallow errors. The throw is the contract — surface the error or let it bubble.

## 8. Choosing the method shape

Each operation returns one of the four shapes defined by `@ethernauta/transport`:

- **`Readable<T>`** — needs RPC reads, no wallet. Most verifications. The signer is not involved.
- **`Writable<T>`** — broadcasts a raw transaction.
- **`Signable<T>`** — needs the wallet. JSON-RPC methods that delegate to the user's wallet (`eth_requestAccounts`, `eth_signTypedData_v4`, `personal_sign`, `wallet_sendCalls`, …).
- **`Callable<T>`** — read-only contract call. ERC view/pure methods.

**Pure operations** (e.g. `recover_address`, `namehash`, `wrap_signature`, `unwrap_signature`) are plain functions — don't wrap them in a method shape. The shapes are for things that need a resolved transport, not for pure crypto.

### 8.1. The curry pattern

Outer call validates parameters; inner call accepts the resolved tuple and executes. Never collapse the two calls.

```ts
// EIP single-curry (Signable)
export function eth_requestAccounts(): Signable<string[]> {
  return ([signer, _context]: ResolvedSigner) =>
    signer("eth_requestAccounts", undefined).then((result) => JSON.parse(result))
}
```

```ts
// ERC double-curry (Callable) — (parameters) => (context) => Callable
export function balanceOf(_parameters: Parameters): (_context: ContractContext) => Callable<Uint256> {
  return (_context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    // ...
  }
}
```

### 8.2. The `method/` subfolder (EIPs only)

When an EIP defines a JSON-RPC method the dapp calls through the signer (EIP-1102's `eth_requestAccounts`, EIP-712's `eth_signTypedData_v4`, …), put it under `packages/eip/src/<n>/method/<eth_methodName>.ts`. The filename matches the JSON-RPC method exactly. Re-export from `index.ts`.

## 9. ERC method bindings — the specifics

### 9.1. The `union(tuple, object)` parameters shape

Methods that take args accept either a positional tuple or a named object. Match exactly in every new ERC method file:

```ts
const ParametersSchema = union([
  tuple([AddressSchema, Uint256Schema]),
  object({ to: AddressSchema, value: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
```

This lets callers write `transfer(["0x...", value])` or `transfer({ to: "0x...", value })` interchangeably. Anything else is a regression in the public API.

### 9.2. The `<METHOD>_SIGNATURE` sidecar export

Every ERC method file exports a sidecar constant:

```ts
export const TRANSFER_SIGNATURE = {
  signature: "transfer(address,uint256)",
  names: ["to", "value"],
}
```

Reason: the wallet renders a human-readable confirmation by matching `keccak(signature)[0:4]` against `input[0:4]`. The codegen registry walks `packages/erc/src/**` looking for these `_SIGNATURE` exports.

### 9.3. The `_ethernauta.function` sidecar in `Signable` methods

The state-changing method must emit `eth_signTransaction` with a `_ethernauta.function` sidecar. This is the implementation's responsibility — consumers don't pass it; they just call the binding. Pattern:

```ts
return eth_signTransaction([{
  to: _context.to,
  value: "0x0",
  input: bytes_to_hex(calldata),
  _ethernauta: { function: TRANSFER_SIGNATURE },
}])([signer, _context])
```

Without the sidecar the wallet shows raw calldata and the binding is incomplete.

### 9.4. The wallet fills gas and nonce

When emitting `eth_signTransaction`, set ONLY `to`, `value`, `input`, and `_ethernauta`. NEVER set `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`. The wallet fills those from `eth_getTransactionCount` + `eth_estimateGas` + `eth_feeHistory`. The contract is: generator emits `to/value/input/_ethernauta`, wallet does the rest.

### 9.5. The reference files

Every ERC folder ships the canonical Solidity source as `IERC<n>.sol` (commented header notes upstream) and the canonical ABI as `IERC<n>.abi.json` (copied from the OpenZeppelin reference implementation or the EIP itself). Bindings are generated from the ABI file.

### 9.6. The selector registry

`packages/erc/src/registry/registry.generated.ts` is auto-generated by:

```bash
pnpm --filter @ethernauta/erc generate
```

which runs `ethernauta registry --in src --out src/registry/registry.generated.ts`. The script walks `packages/erc/src/**` for `<METHOD>_SIGNATURE` exports and rebuilds the 4-byte-selector → method map. Runs automatically before `build` via the `prebuild` hook.

**Never hand-edit `registry.generated.ts`.** Regenerate after adding methods.

## 10. Tests — co-located, behavioral, transport-mocked

- One test file per operation, co-located. `verify-hash.ts` next to `verify-hash.test.ts`. For ERCs, the behavioral test is `packages/erc/src/<n>/<n>.test.ts`.
- Use `parse` against your own schema when constructing string-literal inputs in tests — catches regex drift between the spec and your schema.
- Mock the transport, not the entire signer protocol:
  - For `Readable` / `Writable` / `Callable`: pass a fake `transports` array of functions that return canned responses.
  - For `Signable`: pass a fake `signer` function that returns canned JSON strings.
- For ERCs, behavioral tests build calldata for a known input and assert against expected hex; for `Callable`, also call `decode` against a known result.

## 11. Subpath publishing — no `package.json` edits

`packages/eip/package.json` and `packages/erc/package.json` both declare:

```json
"./*": "./dist/*/index.js"
```

Creating `packages/eip/src/<n>/` automatically makes it importable as `@ethernauta/eip/<n>` after build. No `package.json` edits needed — just create the folder and build.

## 12. Cross-package imports

### 12.1. EIPs

**Allowed:**
- `@ethernauta/core` — primitive schemas (always).
- `@ethernauta/utils` — pure utilities (`bytes_to_hex`, `hex_to_bytes`, `number_to_hex`, `rlp_encode`).
- `@ethernauta/transport` — `Readable`, `Writable`, `Signable`, `Callable`, `ResolvedReader`, `ResolvedSigner`, `ResolvedContract`, `CallSchema`, `ParametersSchema`.
- `@ethernauta/abi` — only when the EIP requires ABI encode/decode (e.g. 6492 decodes `(address, bytes, bytes)`).
- `@noble/hashes`, `@noble/secp256k1` — pure crypto.
- Other `@ethernauta/eip/<m>` subpaths — fine when one EIP genuinely builds on another (e.g. `1271/verify-message.ts` importing `../191/personal-message`).
- `valibot`.

**Forbidden:**
- `@ethernauta/wallet` — the wallet depends on EIPs, not the other way around.
- `@ethernauta/erc`, `@ethernauta/ens` — ERCs and ENS sit ABOVE the EIP layer (they depend on EIPs). The reverse would be circular.
- DOM-only globals (`window`, `document`) — EIP code runs in the wallet popup, the service worker, and dapp code. Use `globalThis` if you really need runtime branching.

### 12.2. ERCs

**Allowed:**
- `@ethernauta/core` — primitive schemas.
- `@ethernauta/abi` — `encode_function_call`, `decode_function_result`, codec helpers (`address`, `uint256`, `bytes32`, …).
- `@ethernauta/eip/<n>` — only when the ERC builds on an EIP (e.g. an ERC-20 Permit binding using EIP-712 schemas).
- `@ethernauta/ens` — only inside `erc/137`.
- `@ethernauta/eth` — `eth_signTransaction`, `eth_call`. Required for `Signable` methods.
- `@ethernauta/transport` — `Callable`, `Signable`, `ContractContext`, `ResolvedSigner`, …
- `@ethernauta/utils` — pure helpers.
- `valibot`, `@noble/hashes`, `@noble/secp256k1`.

**Forbidden:**
- `@ethernauta/wallet` — wallet is a consumer.
- DOM-only globals.

## 13. Step-by-step — adding `eip-<n>`

1. **Fetch the spec with `curl.md`** (https://github.com/wevm/curl.md). This is the shared tool across all standards work — used for consistency. Read the EIP, list discrete operations, note which need RPC, which need the wallet, which are pure.
2. `mkdir packages/eip/src/<n>`; add an empty `index.ts`.
3. For each schema-bearing input/output: declare a Valibot schema reusing `@ethernauta/core` primitives, derive the type with `InferOutput`. Co-locate in the file that uses it; promote to a sibling file (e.g. `parameters.ts`) only if shared.
4. For each operation: write the function in its own file with the spec-link comment as line 1. Use the `_param` → `parse` → `param` idiom.
5. For each operation: write a co-located `*.test.ts`. Cover spec vectors if the EIP provides them.
6. Curate `index.ts` — re-export only what consumers need.
7. Update `packages/eip/README.md` — add the EIP to the "Currently supports" list with a short API snippet.
8. Build once: `pnpm --filter @ethernauta/eip build`. Verify `dist/<n>/index.js` exists.

## 14. Step-by-step — adding `erc-<n>`

1. **Fetch the spec with `curl.md`** (https://github.com/wevm/curl.md). Shared across all standards work for consistency. Copy the canonical `IERC<n>.abi.json` (from OpenZeppelin or the EIP) into `packages/erc/src/<n>/`. Copy the Solidity reference as `IERC<n>.sol` for documentation.
2. Generate bindings via CLI codegen, or hand-write following `packages/erc/src/20/methods/`. Each method file must:
   - Export the function (camelCase, matching the ABI).
   - Export the `<METHOD>_SIGNATURE` constant.
   - Declare `ParametersSchema` as `union(tuple, object)` if the method takes args.
   - Use `encode_function_call` from `@ethernauta/abi` for input encoding.
   - Use `decode_function_result` from `@ethernauta/abi` for output decoding.
   - Return `(context) => Callable<T>` (view/pure) or `Signable<Bytes>` (state-changing) — the state-changing path includes the `_ethernauta.function` sidecar.
3. Wire `methods/index.ts` with `export * from "./<method>"` per method.
4. Wire `<n>/index.ts` with `export * from "./methods"` plus any helpers.
5. Write `<n>.test.ts` — behavioral.
6. Regenerate the registry: `pnpm --filter @ethernauta/erc generate`.
7. Update `packages/erc/README.md` — add the ERC to the "Currently supports" list with link.
8. Build once: `pnpm --filter @ethernauta/erc build`. Verify `dist/<n>/index.js` and `dist/<n>/methods/<method>.js` exist.
