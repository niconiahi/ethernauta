---
name: gaps
description: Work plan for the ethernauta changes that block the animatronik dog-fooding migration. Read this when planning or executing fixes against the @ethernauta/* packages on behalf of the animatronik refactor. Design reference lives in tmp/non-native-signables/SPEC.md.
---

# Ethernauta gaps — animatronik unblock plan

This is the **action list**. Design reasoning, taxonomy, and per-shape audit
live in `tmp/non-native-signables/SPEC.md`. Read that first if context is
needed; this file is the punch list.

The goal: animatronik (`/Users/niconiahi/Documents/repos/_animatronik`) must
build and run end-to-end using **only** `@ethernauta/*` libraries. No
hand-written contract method shims, no invented JSON-RPC method names, no
external web3 libs. The work below makes that possible.

---

## Ordering

Items are ordered by dependency. Don't skip ahead — later items break or
become impossible without earlier ones.

```
1. delete / retype (cleanup, no dependencies)
2. transport context surface (foundation for 4+)
3. abi encoding primitives (foundation for 4+)
4. abi generator rewrite (reads + writes)
5. interface regeneration (erc-20, erc-165, erc-721 + extensions)
6. consumer rewrites (playground, animatronik)
```

---

## 1. Delete invented methods, retype mis-shaped ones

Per the spec audit, only one truly invented method exists in the library;
three more are correctly named but mis-typed.

### 1.1 Delete
- `packages/eth/src/method/submit/transfer.ts` — not in `execution-apis`.
  Remove the file, the export from `packages/eth/src/method/submit/index.ts`,
  any test, and any call site in tests or examples.

### 1.2 Retype Writable → Signable
Public RPCs do not implement these (no private keys); they belong to the
wallet path.

- `packages/eth/src/method/submit/send-transaction.ts`
  - `Writable<Hash32>` → `Signable<Hash32>`
  - Inner async signature: `(transports: Http[]) => Promise<Hash32>`
    → `(signer: Signer, context: SignContext) => Promise<Hash32>`
  - Wire-level method name stays `eth_sendTransaction`.
- `packages/eth/src/method/sign/sign-transaction.ts`
  - `Writable<Bytes>` → `Signable<Bytes>`
  - Wire-level method name stays `eth_signTransaction`.
- `packages/eth/src/method/sign/sign.ts`
  - `Writable<Bytes65>` → `Signable<Bytes65>`
  - Wire-level method name stays `eth_sign`.

Tests for these methods need updating in lock-step (vitest, co-located).

---

## 2. Transport context surface

Generated contract methods need `to` (and `chain_id`) inside their bodies.
Today's resolver factories don't thread either of these into the callable.

### 2.1 Extend `Readable<T>` and `Signable<T>`

In `packages/transport/src/`:

- `Readable<T>` becomes `(transports: Http[], context: ReadContext) => Promise<T>`
- `Signable<T>` becomes `(signer: Signer, context: SignContext) => Promise<T>`
- `Writable<T>` stays as-is (no contract context needed; `eth_sendRawTransaction`
  carries `to` inside the signed bytes).

Where:
```ts
type ReadContext = { chain_id: caip2_ChainId; to?: Address }
type SignContext = { chain_id: caip2_ChainId; to?: Address }
```

`to` is **optional** at the type level. Native methods ignore it; contract
methods validate its presence at call time and throw with a clear message if
missing.

### 2.2 Extend `create_reader` / `create_signer`

The factory invocation becomes:

```ts
const reader = create_reader([{ chainId, transports }])
const signer = create_signer([{ chainId, transports: [] }])

reader({ chain_id })                  // native
reader({ chain_id, to: contract })    // contract read
signer({ chain_id })                  // native
signer({ chain_id, to: contract })    // contract write
```

The factory returns a `(context: { chain_id, to? }) => Http[]` or equivalent
that the `Readable`/`Signable` callable then consumes. Adjust call sites
inside `@ethernauta/eth`, `@ethernauta/eip`, and `@ethernauta/erc` so every
existing Readable/Signable accepts and ignores the new context where it
doesn't need it.

### 2.3 `Signer` itself

`Signer = (method: string, params: unknown) => Promise<string>` stays the
same (no brand for now — decision 3). The encoding work happens *above* it,
in the generated Signable's body, not in the Signer protocol.

---

## 3. ABI encoding primitives

`@ethernauta/abi/encoding/encode.ts` already exists. The generator outputs
need two operations from it; verify both are present and add what's missing.

### 3.1 Required surface

- `encode_function_call(fragment, params): Bytes` — produces `0x<selector><encoded args>`.
- `decode_function_result(fragment, hex): T` — abi-decodes the `eth_call`
  return blob using the fragment's `outputs`.

Both keyed by an ABI fragment of the shape:
```ts
type FunctionFragment = {
  name: string
  inputs: AbiParameter[]
  outputs: AbiParameter[]
  stateMutability: "view" | "pure" | "nonpayable" | "payable"
}
```

### 3.2 Coverage requirements

Encoder/decoder must support the types animatronik touches:
- `string`
- `uint256`
- `address`
- `bool`
- `bytes32` (for ERC-165 interface id checks if needed)

Plus dynamic arrays of the above (for ERC-721 enumerable batch reads if a
caller composes them). Confirm by reading the existing `encode.test.ts` and
extending it with these cases.

---

## 4. ABI generator rewrite

`packages/abi/src/generator/generator.ts` currently emits broken Signables
(call `_signer("method_name", params)` directly — no encoding) and broken
Readables (call `transport({method: "method_name", params})` — node returns
`-32601`). Rewrite by mutability.

### 4.1 Read path (view / pure)

Generated file shape:
```ts
import type { Readable, Http, ReadContext } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { encode_function_call, decode_function_result }
  from "@ethernauta/abi"

const FRAGMENT = { /* stamped from ABI at generation time */ } as const

export function get_data(
  _parameters: Parameters,
): Readable<string> {
  return async (
    transports: Http[],
    context: ReadContext,
  ): Promise<string> => {
    const parameters = parse(parametersSchema, _parameters)
    const { to } = parse(read_context_schema, context)
    const input = encode_function_call(FRAGMENT, parameters)
    const call = parse(callSchema, [
      "eth_call",
      [{ to, input }, "latest"],
    ])
    const response = await Promise.any(
      transports.map((t) => t(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return decode_function_result(FRAGMENT, response.result)
  }
}
```

`read_context_schema` enforces `to` is present (since this is a contract read).

### 4.2 Write path (nonpayable / payable)

Generated file shape:
```ts
import type { Signable, Signer, SignContext } from "@ethernauta/transport"
import { eth_signTransaction } from "@ethernauta/eth"
import { encode_function_call } from "@ethernauta/abi"

const FRAGMENT = { /* stamped from ABI */ } as const

export function mint(
  _parameters: Parameters,
): Signable<Bytes> {
  return async (
    signer: Signer,
    context: SignContext,
  ): Promise<Bytes> => {
    const parameters = parse(parametersSchema, _parameters)
    const { chain_id, to } = parse(sign_context_schema, context)
    const input = encode_function_call(FRAGMENT, parameters)
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction([{
      to,
      value: "0x0",
      input,
      chainId: chain_id_to_hex(chain_id),
    }])(signer, { chain_id })
  }
}
```

Return type is the signed RLP bytes hex (`Bytes`). Caller pairs with
`eth_sendRawTransaction([signed])(writer({chain_id}))`. **Do not** add an
`eth_sendTransaction` (unified) variant to the generator — split is canonical
(decision 5).

### 4.3 Naming convention in generator output

- File names: `<contract-method-snake-case>.ts` if the source method is camelCase
  (`balanceOf` → `balance-of.ts`), or kept verbatim if the source is already
  snake_case (`get_data` → `get_data.ts`). Matches current behavior.
- Export name matches the source method name verbatim — the JSON-RPC method-
  name exception in the ethernauta convention applies to contract methods too.

### 4.4 Regenerate generator tests

Existing `packages/abi/src/generator/generator.test.ts` validates old broken
output. Rewrite assertions against the new shape. Add cases for both view
and nonpayable methods so regressions surface immediately.

---

## 5. Regenerate ERC interfaces from OpenZeppelin sources

Per the dogfooding rule: no hand-written contract method shims. Replace
everything in `packages/erc/src/{20,165,721}/methods/` with generator output.

### 5.1 Sources

Pull the canonical interfaces from OpenZeppelin master:
- ERC-165: `IERC165.sol`
- ERC-20: `IERC20.sol`, `IERC20Metadata.sol`
- ERC-721: `IERC721.sol`, `IERC721Metadata.sol`, `IERC721Enumerable.sol`,
  `IERC721Receiver.sol` *(if relevant)*

Process per source:
1. Fetch the `.sol` from the OpenZeppelin repo.
2. Compile to ABI JSON (foundry / solc — pick one and document).
3. Run the abi generator (`packages/abi/src/generator/cli.ts`) against the
   ABI JSON, output to the target erc subdir.
4. Diff against current hand-written files; reconcile any divergence (the
   generated output is the source of truth — hand-written goes away).

### 5.2 Required-for-animatronik subset

Animatronik's `showcase` route needs ERC-721 Enumerable:
- `totalSupply()` → `Readable<uint256>`
- `tokenByIndex(uint256)` → `Readable<uint256>`
- `tokenOfOwnerByIndex(address, uint256)` → `Readable<uint256>`

These are currently **missing** from `packages/erc/src/721/methods/`. After
regeneration via `IERC721Enumerable.sol`, they will exist.

ERC-721 Metadata (`name`, `symbol`, `tokenURI`) is not strictly required for
animatronik but should land in the same regeneration pass for completeness.

---

## 6. Consumer rewrites

After 1–5 land, the consumer code adjusts.

### 6.1 Playground (`examples/playground/app/routes/home.tsx`)

Today:
```ts
const signed_transaction = await signer({ chain_id })(
  "transfer",
  [recipient, number_to_hex(1)],
)
```

After:
```ts
const signed_transaction = await eth_signTransaction([{
  to: recipient,
  value: number_to_hex(1),
}])(signer({ chain_id }))
```

No raw `_signer(method_string, params)` call sites remain anywhere in the
workspace after this. Grep to confirm.

### 6.2 Animatronik generated dir

`_animatronik/app/generated/animatronik/methods/*.ts` regenerates via the
updated abi generator from
`_animatronik/contracts/src/AnimatronikContract.sol` (compile to ABI first if
needed). After regeneration, the route call sites do not change — the API
surface `mint([data])(signer({chain_id, to}))` and
`get_data([token_id])(reader({chain_id, to}))` is already what
`_animatronik/app/routes/dapp.add.tsx` uses. The bodies just become correct.

### 6.3 `_animatronik/app/routes/dapp.tsx` cleanup

Remove the `window.ethereum` client-loader path; account discovery flows only
through `eth_requestAccounts()(signer({chain_id}))`. This was already on the
list; it becomes mechanical after the rest.

---

## Acceptance criteria

The migration is complete when:

1. `grep -r 'submit/transfer' packages/` returns nothing.
2. No file in `packages/eth/src/method/` is typed `Writable` if its spec
   counterpart requires private keys.
3. `Readable<T>` / `Signable<T>` callables accept a `context` arg
   workspace-wide.
4. Generator output for a view function dispatches `eth_call`; for a
   non-view function it composes onto `eth_signTransaction`. Verified by
   the generator's own tests.
5. All `packages/erc/src/{20,165,721}/methods/*.ts` files are generated
   from OpenZeppelin sources and pass the existing erc test suites.
6. ERC-721 Enumerable methods (`totalSupply`, `tokenByIndex`,
   `tokenOfOwnerByIndex`) exist as generated `Readable<uint256>`s.
7. No `_signer("<method_name>", ...)` raw call sites exist anywhere in
   `examples/` or in `_animatronik/`.
8. `_animatronik` builds, dev-serves, and the mint flow works end-to-end
   against Sepolia with the Ethernauta wallet extension.

---

## Out of scope (intentionally deferred)

- `SignerMethod` branded type / lint rule to forbid raw signer string calls
  (decision 3). Revisit after this migration lands.
- Contract event subscription helpers (shape #7 in SPEC). Animatronik
  doesn't need them.
- Library-side prefetch of nonce/gas/fees. Wallet owns this (decision 2).
- Collapse of `Writable` into `Readable` / `Signable` (decision 4). Keep
  the distinction.
- Unified `eth_sendTransaction` as the recommended path (decision 5). Stays
  available but not generated for, not documented as primary.

---

## Reference

- Design spec: `tmp/non-native-signables/SPEC.md` — full taxonomy, per-shape
  audit, settled design decisions.
- Architecture orientation: `.claude/skills/ethernauta/SKILL.md` — package
  map, method shapes, invariants, conventions.
- Ethereum JSON-RPC source of truth:
  `https://github.com/ethereum/execution-apis/tree/main/src/eth`.
