---
title: Adding a new EIP / ERC
section: Tooling
section_order: 8
order: 2
---

# Adding a new EIP or ERC

The library is designed so that adding a numbered standard is a **folder + done** operation. No coordinated wallet release, no server deploy, no hosted-infra dependency (hard rule 11, M1, M4).

This page is the template.

## Step 1 — Pick the package

| Standard type | Package | Folder |
|---|---|---|
| Protocol / wallet / signing | `@ethernauta/eip` | `packages/eip/src/<n>/` |
| Token / contract interface | `@ethernauta/erc` | `packages/erc/src/<n>/` |

Use the spec's own namespace (`EIP-N` → `eip`, `ERC-N` → `erc`).

## Step 2 — Author the folder

Minimum shape:

```
packages/eip/src/7777/
  index.ts                    ← spec link + re-exports
  schemas/
    payload.ts                ← Valibot schemas
  methods/
    do-the-thing.ts           ← method binding (returns Readable/Writable/Signable)
  utils/
    helpers.ts                ← non-RPC helpers
```

The `index.ts` opens with the spec URL comment and re-exports the public surface:

```ts
// https://eips.ethereum.org/EIPS/eip-7777
export { payloadSchema, type Payload } from "./schemas/payload";
export { do_the_thing } from "./methods/do-the-thing";
```

## Step 3 — Schemas first

Hard rule 1 in CLAUDE.md: **every value-bearing type is a Valibot schema first, type via `InferOutput` second.** No `interface`, no hand-rolled `type X = { ... }`.

```ts
import * as v from "valibot";
import { addressSchema, uint256Schema } from "@ethernauta/core";

export const payloadSchema = v.object({
  account: addressSchema,
  amount: uint256Schema,
});

export type Payload = v.InferOutput<typeof payloadSchema>;
```

If you find yourself reaching for a regex (an address, a hash, a bytesN) — **stop**. Import from `@ethernauta/core`. If the primitive you need doesn't exist there, add it to `core` first (hard rule 3).

## Step 4 — Method bindings (pick the shape)

Decide which resolver shape each method uses. This is the **single most important** decision; it determines whether the method needs a wallet.

| Shape | Use | Wallet needed |
|---|---|---|
| `Readable<T>` | chain read | no |
| `Writable<T>` | broadcast bytes | no |
| `Signable<T>` | sign or wallet-state read | yes |
| `Callable<T>` | `eth_call` with ABI decode | no |

Then implement the method as a curried function:

```ts
import * as v from "valibot";
import type { Readable } from "@ethernauta/transport";

export const do_the_thing = (_args: unknown): Readable<Uint256> => {
  const args = v.parse(payloadSchema, _args);

  return async (resolved) => {
    // ...build JSON-RPC payload, call resolved.request, parse response
  };
};
```

Hard rule 4: the curried shape **never collapses**. Two calls, in order: `method(args)` then `(resolver(...))`.

## Step 5 — Wire the subpath export

Add the subpath to the package's `package.json` `exports` field:

```json
{
  "exports": {
    "./7777": {
      "import": "./dist/7777/index.js",
      "types": "./dist/7777/index.d.ts"
    }
  }
}
```

Now consumers can `import { ... } from "@ethernauta/eip/7777"`.

## Step 6 — Wallet integration (if applicable)

If the new standard adds an RPC method the wallet should serve, update the dispatcher's allowlists in `packages/wallet/src/utils/dispatch.ts`:

- Chain-read method → `CHAIN_READ_METHODS`.
- Signable method → `SIGNABLE_METHODS`, plus a confirmation view under `packages/wallet/src/views/`.
- Wallet-state method → `WALLET_STATE_METHODS`.
- Wallet-internal method → `WALLET_INTERNAL_METHODS`.

For signable methods, the confirmation view's job is described in [Wallet → views](/wallet/views). Every view is a contract — its inputs are the dispatcher's envelope, its output is a signature (or 4001 user-rejected).

## Step 7 — ERC-specific: regenerate

If you added an ERC and dropped a canonical ABI at `packages/erc/src/<n>/abi.json`:

```bash
pnpm --filter @ethernauta/erc generate
```

This emits the method files and updates the selector registry.

## Step 8 — Docs page

Add a `docs/content/eips/<n>.md` or `docs/content/ercs/<n>.md`. Follow the existing templates: spec link, one-paragraph what + why, surface table, code example, `See also`. Tag the order field so it sorts in numeric position within the section.

## Step 9 — Test

Vitest in the package: `packages/eip/<n>/` is colocated. Mock the transport with a `Readable` / `Writable` / `Signable` stub; assert the JSON-RPC payload shape.

## Step 10 — Commit

```bash
git commit -m "feat(eip): add 7777 — the thing it does"
```

Done. No server changed, no hosted service, no wallet release coupled to the rollout (other than the dispatcher allowlist update if applicable). That's the folder + done property in action.

## See also

- [Concepts → folder-shaped standards](/concepts/folder-shaped-standards) — the philosophy this template enforces.
- [Concepts → schemas are the types](/concepts/schemas-are-types) — why Valibot first.
- [Concepts → resolver shapes](/concepts/resolver-shapes) — how to pick `Readable` / `Writable` / `Signable` / `Callable`.
- [@ethernauta/erc → registry](/ercs/registry) — the registry that gets regenerated.
