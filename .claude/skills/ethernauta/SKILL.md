---
name: ethernauta
description: Official Ethernauta maintainer orientation. Read before implementing anything in this library — covers package boundaries, method shapes, invariants, and the full architecture mental model.
---

# Ethernauta Architecture

Read this before touching anything. One pass through this file is enough to orient every implementation decision.

---

## Package Map

```
@ethernauta/transport   Network primitives + protocol types (published)
@ethernauta/eth         Ethereum JSON-RPC methods + types (published)
@ethernauta/eip         EIP protocol implementations (published)
@ethernauta/chain       Static chain configs — 500+ EIP-155 chains (published)
@ethernauta/wallet      Chrome extension — private, not published
apps/playground         Dev testing env — React Router, Cloudflare Pages
```

**Dependency direction:** `wallet` and `eip` depend on `transport`. `eth` depends on `transport`. Nothing depends on `wallet`. Never create circular deps.

---

## The Three Method Shapes

Every method in this library is one of these three. Know which before writing a line.

### 1. `Readable<T>` — state query via JSON-RPC

```ts
// packages/eth/src/method/state/get-balance.ts
export function eth_getBalance(
  _parameters: Parameters,
): Readable<Uint> {
  return async (transports: Http[]): Promise<Uint> => {
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response)
      throw new Error(response.error.message)
    return parse(uintSchema, response.result)
  }
}
```

Use for: reading chain state (balance, nonce, code, block, receipt, fee history).

### 2. `Writable<T>` — state mutation via JSON-RPC

Same structure as `Readable<T>`, different semantic type. Use for: submitting transactions, sending raw data to the node.

```ts
export function eth_sendRawTransaction(
  _parameters: Parameters,
): Writable<Hash32> { ... }
```

### 3. `Signable<T>` — wallet interaction via extension

```ts
// packages/eip/src/1102/method/eth_requestAccounts.ts
export function eth_requestAccounts(): Signable<string[]> {
  return (signer: Signer) =>
    signer("eth_requestAccounts", undefined)
      .then((result) => JSON.parse(result))
}
```

Use for: anything that requires the user's wallet — account access, signing, sending from a managed key. The `Signer` is the bridge to the wallet extension via `window.postMessage`.

---

## Where New Code Goes

| What you're adding | Package |
|---|---|
| A new `eth_*` JSON-RPC method | `packages/eth/src/method/<domain>/` |
| A new Ethereum type (Block, Transaction variant, etc.) | `packages/eth/src/core/` |
| A new EIP protocol implementation | `packages/eip/src/<EIP number>/` |
| A new transport primitive or chain ID utility | `packages/transport/src/` |
| A new chain definition | `packages/chain/src/chain/eip155/` |
| Extension UI, vault, signing logic | `packages/wallet/src/` |

**EIP package rule:** one directory per EIP number. If the EIP defines methods, put them in `<EIP number>/method/<method_name>.ts` and export from `<EIP number>/index.ts`. See `1102/` for the reference shape.

---

## Transport Primitives

The foundational types all live in `@ethernauta/transport`:

```
Http          = (call: Call) => Promise<Response>
Reader        = (chainId: string) => Http[]
Writer        = (chainId: string) => Http[]
Signer        = (method: string, params: unknown) => Promise<string>
Readable<T>   = (transports: Http[]) => Promise<T>
Writable<T>   = (transports: Http[]) => Promise<T>
Signable<T>   = (signer: Signer) => Promise<T>
```

`create_reader` and `create_writer` are identical in implementation but semantically different — one is for reads, one for writes. Keep them separate.

`create_signer` is the wallet bridge. It takes a chain config, returns a curried function keyed by chainId that returns a `Signer`. The signer fires a `ETHERNAUTA_REQUEST_SIGN_TRANSACTION` postMessage and waits for the extension to respond.

---

## Invariants — Never Break These

**1. Valibot on every boundary.**
Validate every input parameter and every RPC response result with a Valibot schema before using it. Use `parse()`, not `safeParse()` — let it throw. No raw casting.

**2. CAIP-2 chain IDs everywhere.**
Chain IDs are always strings of the form `eip155:1`, never raw integers. Use `encode_chain_id` / `decode_chain_id` from `@ethernauta/transport`. The `chainIdSchema` enforces the regex `^[-:a-zA-Z0-9]{5,41}$`.

**3. Methods are factories.**
`eth_getBalance(params)` returns a `Readable<T>`. It does not execute. The caller applies the transport: `eth_getBalance(params)(reader("eip155:1"))`. Never collapse these into one call.

**4. `Promise.any()` for transport dispatch.**
When dispatching to multiple transports, use `Promise.any()` — first to succeed wins. Never `Promise.all()` (that's a fan-out, not a fallback). Never sequential.

**5. snake_case for all functions and variables.**
Enforced by Biome. Method names follow the JSON-RPC spec (`eth_getBalance`) — these are the only camelCase identifiers in the codebase, and only because the spec defines them that way.

**6. 60-character line width.**
Enforced by Biome. Keep declarations tight. If a type or call chain is getting long, break it across lines.

**7. No comments unless the WHY is non-obvious.**
The spec URL is always worth keeping (e.g., `// https://eips.ethereum.org/EIPS/eip-1193`). Implementation narration is not.

**8. Security: never log private keys, mnemonics, or passwords.**
Ever. Not in dev, not in error messages, not in test output.

---

## Method Parameters Pattern

Methods in `@ethernauta/eth` always accept parameters in multiple shapes — positional tuple or named object. Define a `parametersSchema` union and validate before building the call:

```ts
const parametersSchema = union([
  tuple([addressSchema, blockNumberOrTagOrHashSchema]),
  tuple([addressSchema]),
  object({ address: addressSchema, block: blockNumberOrTagOrHashSchema }),
  object({ address: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
```

This makes the method ergonomic for callers without losing type safety.

---

## Adding a New `eth_*` Method — Checklist

1. Pick the right shape: `Readable`, `Writable`, or `Signable`
2. Place in `packages/eth/src/method/<domain>/<method-name>.ts`
3. Define `parametersSchema` (tuple + object union) if the method takes params
4. Define the output schema using types from `packages/eth/src/core/`
5. Implement: validate params → build `Call` → `Promise.any(transports.map(...))` → validate result
6. Export from `packages/eth/src/method/<domain>/index.ts` and up through `packages/eth/src/method/index.ts` and `packages/eth/src/index.ts`
7. Write a test co-located at `<method-name>.test.ts`

---

## Adding a New EIP — Checklist

1. Create `packages/eip/src/<number>/`
2. If it defines a `Provider`-level interface, put it in `<number>/index.ts`
3. If it defines methods, put each in `<number>/method/<eth_methodName>.ts` as `Signable<T>`
4. Export everything from `<number>/index.ts`
5. Link the EIP spec URL in a comment at the top of `index.ts`

---

## The Signer–Provider Split

`create_provider` (EIP-1193) is **skinny**: it handles the provider event interface and a minimal `request()` switch. It does not know how to sign anything. It only knows `eth_chainId` natively.

`create_signer` (transport) is **dumb**: it is a raw postMessage bridge. It knows nothing about Ethereum — just method strings and params.

Methods that require wallet interaction are `Signable<T>` — they take a `Signer` directly, not a `Provider`. This keeps the signing surface narrow and testable in isolation.

---

## Extension Messaging Protocol

The wallet extension communicates via `window.postMessage` with typed message envelopes:

```
ETHERNAUTA_REQUEST_SIGN_TRANSACTION   → from page to extension
ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION → from extension to page (success)
ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED → from extension to page (user rejected)
ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE → from extension to page (closed)
```

Every message carries a `crypto.randomUUID()` id for correlation. The signer registers a one-shot `message` event listener keyed by that id and cleans it up immediately on resolution or rejection.

---

## Coding Conventions

### Naming

**Functions and variables:** always `snake_case`.
```ts
// correct
const chain_id = encode_chain_id({ namespace, reference })
function create_reader(chains) { ... }

// wrong
const chainId = ...
function createReader(chains) { ... }
```

**JSON-RPC method names** are the only exception — they follow the spec verbatim: `eth_getBalance`, `eth_blockNumber`, `eth_requestAccounts`. The underscore in those is from the spec, not the codebase convention.

**Module-level constants** use `UPPER_SNAKE_CASE`:
```ts
const DELIMITER = ":"
const ERROR_CODE = { USER_REJECTED_REQUEST: 4001 } as const
const ANNOUNCE_EVENT = "eip6963:announceProvider" as const
```

**Local variables inside functions** use `snake_case`:
```ts
const method = "eth_getBalance"
const target_chain = parse(chainIdSchema, _targetChain)
```

**File names:** `kebab-case.ts` for all source files. Exception: EIP method files are named after the spec method — `eth_requestAccounts.ts`.

---

### The Underscore Prefix Convention

Raw, unvalidated inputs are prefixed with `_`. After `parse()`, the underscore drops:

```ts
export function eth_getBalance(
  _parameters: Parameters,  // raw — not yet validated
): Readable<Uint> {
  return async (transports: Http[]) => {
    const parameters = parse(parametersSchema, _parameters)
    // ↑ now safe to use
  }
}
```

Also applies to inner function arguments:
```ts
create_reader(chains): (_targetChain: string) => {
  const targetChain = parse(chainIdSchema, _targetChain)
  ...
}
```

This is a visual contract: `_x` = untrusted, `x` = validated.

---

### Schema and Type Naming

Every type is derived from its schema via `InferOutput`. Never write types manually.

```ts
export const uintSchema = custom<`0x${string}`>(isUint)
export type Uint = InferOutput<typeof uintSchema>
```

**Schema naming:**
- Primitive/basic types: `camelCase` + `Schema` suffix → `uintSchema`, `addressSchema`, `bytesSchema`, `blockTagSchema`
- Named semantic concepts: `PascalCase` + `Schema` suffix → `Hash32Schema`, `TransactionInfoSchema`, `TransactionSignedSchema`
- The distinction is semantic: `bytes32` is raw data, `Hash32` is a meaningful concept that happens to be 32 bytes

**CAIP namespaced types** use a `caip2_` prefix on both schema and type:
```ts
export const caip2_namespaceSchema = custom<string>(isNamespace)
export type caip2_Namespace = InferOutput<typeof caip2_namespaceSchema>
```

**TypeScript types** are always `PascalCase` regardless of schema casing.

**Private validator functions** (not exported):
```ts
// private — not exported
function isUint(input: unknown): boolean {
  return typeof input === "string" && /^0x.../.test(input)
}
// public — exported
export const uintSchema = custom<`0x${string}`>(isUint)
```

---

### Import Style

Types are always imported with `import type`:
```ts
import type { Http, Readable } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
```

Values (schemas, functions) are imported without `type`:
```ts
import { callSchema } from "@ethernauta/transport"
import { object, parse, tuple, union } from "valibot"
```

Biome's `organizeImports: on` handles ordering automatically. External packages come before internal imports.

---

### Method Implementation Structure

Every `Readable`/`Writable` method follows this exact structure — no variation:

```ts
export function eth_someMethod(
  _parameters: Parameters,
): Readable<OutputType> {
  return async (
    transports: Http[],
  ): Promise<OutputType> => {
    const method = "eth_someMethod"         // 1. name the method
    const parameters = parse(               // 2. validate input
      parametersSchema,
      _parameters,
    )
    const call = parse(callSchema, [        // 3. build call
      method,
      parameters,
    ])
    const response = await Promise.any(     // 4. dispatch
      transports.map((transport) =>
        transport(call),
      ),
    )
    if ("error" in response) {              // 5. check error
      throw new Error(response.error.message)
    }
    const result = parse(                   // 6. validate output
      outputSchema,
      response.result,
    )
    return result                           // 7. return
  }
}
```

Return type annotations are explicit on both the factory and the inner async function.

For no-param methods, skip steps 2–3 and call `parse(callSchema, [method])`.

---

### Spec URL Comments

Link the defining spec at the top of any file that implements a protocol:

```ts
// https://eips.ethereum.org/EIPS/eip-1193
// https://github.com/ethereum/execution-apis/blob/main/src/schemas/base-types.yaml
// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
```

This is the one comment type that is always correct. Implementation narration is not.

---

### Error Handling

In methods — check `"error" in response`, then throw with the RPC message:
```ts
if ("error" in response) {
  throw new Error(response.error.message)
}
```

In the signer — reject with an EIP-1193 error object:
```ts
reject({
  code: ERROR_CODE.USER_REJECTED_REQUEST,
  message: "User rejected request",
})
```

In the vault — throw descriptive `Error` instances:
```ts
throw new Error("Mnemonic cannot be empty")
```

Never swallow errors. Never throw plain strings. Never use `safeParse()` unless you intend to handle the failure branch explicitly.

---

### Linter Rules That Shape the Code

These Biome rules are set to `error` — code that violates them won't pass CI:

| Rule | What it means |
|---|---|
| `noParameterAssign` | Never reassign a parameter — create a new `const` |
| `useAsConstAssertion` | Use `as const` for literal objects/arrays |
| `useDefaultParameterLast` | Default params go at the end of the signature |
| `useSingleVarDeclarator` | One `const`/`let` per declaration |
| `noUnusedTemplateLiteral` | Don't use template literals when string concatenation would do |
| `useNumberNamespace` | `Number.isNaN` not `isNaN`, `Number.parseInt` not `parseInt` |
| `noInferrableTypes` | Don't annotate types that TypeScript already infers |
| `noUselessElse` | No `else` after a `return` or `throw` |
| `useSelfClosingElements` | Self-close JSX elements that have no children |

---

## Testing Conventions

- Framework: Vitest, edge-runtime environment
- Test files live co-located with source: `get-balance.test.ts` beside `get-balance.ts`

**Describe block naming:** name the file being tested.
```ts
describe("encode-chain-id.ts", () => {
  it("should correctly encode with valid parameters", () => {
```

**Flat tests** (no describe) are acceptable for simple modules — vault tests and CAIP tests use this pattern.

**Test descriptions** start with `"should"`:
```ts
it("should correctly parse a valid chain id", ...)
it("should throw error when saving empty mnemonic", ...)
```

**Assertion style:**
- Primitives: `expect(x).toBe(y)`
- Objects: `expect(x).toEqual(y)`
- Async errors: `await expect(promise).rejects.toThrow("message")`
- Sync errors: `expect(() => fn()).toThrow()` or `.not.toThrow()`

**Test data:** use realistic production-like values — actual hex hashes, real-looking addresses, valid chain IDs. Not `"0x123"` but `"0xdb9a5f2320c0a10d28bfa1c563a1bbf592665e9..."`.

**Vault tests** use `fake-indexeddb` via `import "fake-indexeddb/auto"`. Do not mock the native crypto APIs — let them run real.

**Schema tests** validate both happy path and rejection:
```ts
it("should validate a correct value", () => {
  expect(() => parse(schema, valid)).not.toThrow()
})
it("should reject an invalid value", () => {
  expect(() => parse(schema, invalid)).toThrow()
})
```

Coverage priority: security-critical paths (vault, transaction signing) need comprehensive tests. Schema validators and utility functions need minimal smoke tests.
