---
title: Schemas are the types
section: Concepts
section_order: 2
order: 4
---

# Schemas are the types

The non-negotiable typing rule across the monorepo: **every value-bearing type starts as a Valibot schema**. The TypeScript type comes from `v.InferOutput<typeof schema>`.

```ts
import * as v from "valibot";
import { AddressSchema } from "@ethernauta/core";

const userSchema = v.object({
  address: AddressSchema,
  nickname: v.string(),
});

type User = v.InferOutput<typeof userSchema>;

declare const _example: User;
void _example;
```

That's the whole convention. The schema is the single source of truth; the type is derived. You never write `interface User { … }` for wire-bearing data. You never write `type User = { address: string; nickname: string }`.

## Parse at the boundary

The complement of schema-first typing: **boundaries validate with `parse`**, not `safeParse`.

```ts
import * as v from "valibot";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";

const sendParamsSchema = v.object({
  to: AddressSchema,
  value: UintSchema,
  input: BytesSchema,
});

declare function broadcast(_params: v.InferOutput<typeof sendParamsSchema>): Promise<string>;

function send(_params: unknown) {
  const params = v.parse(sendParamsSchema, _params); // throws on invalid
  // `params` is now `SendParams`, statically typed, runtime-validated
  return broadcast(params);
}
```

The underscore-prefix convention (`_params` → `params`) signals "loose at the door, validated inside." Throws are the contract — invalid input is a developer error, not a recoverable failure mode. `safeParse` is reserved for places where you genuinely want to branch on validity (rare in this codebase; usually a smell).

## Where it matters

This rule is enforced not just for prettiness but for three concrete reasons:

**Wire safety.** Every value crossing `postMessage`, `chrome.runtime`, or an HTTP boundary gets parsed. The wallet's dispatcher in `packages/wallet/src/utils/dispatch.ts` parses every incoming envelope before it touches a handler. The transport layer parses every JSON-RPC response before it returns. There is no untyped wire data in the interior.

**Single source of truth.** When a standard updates its schema (EIP-7702's authorization tuple changed shape multiple times during the draft phase), one edit at the Valibot definition flows through to the type, the parser, and any consumer. Hand-rolled type aliases would have created drift opportunities.

**Composability.** Primitive schemas live in `@ethernauta/core` (`AddressSchema`, `Bytes32Schema`, `Hash32Schema`, `Uint256Schema`, …). Feature packages compose them. Adding a new EIP doesn't redeclare what an address is — it uses `AddressSchema`. The catalog is small and stable; the compositions are large and ever-growing.

## The forbidden shapes

These produce ratchet violations in CI (`scripts/no-escape-hatches.sh`):

```ts ignore
// NO — interfaces for value-bearing data
interface User { address: string }

// NO — hand-rolled object types
type User = { address: string }

// NO — `as` to widen or coerce
const user = raw as User

// NO — escape hatches
// @ts-ignore
const x: any = somethingUntyped

// NO — redundant annotations the inference would have given you anyway
const reader: Reader = create_reader([chain1])
```

The recursive Valibot anchor and the irreducible mapped-tuple boundary in `decode_function_result` have documented exceptions tagged `// allow-violation: <tag>`. Everything else is fixable.

## The schemas catalog

The primitives that compose everything else:

- `AddressSchema` — checksummed `0x` + 40 hex chars.
- `Bytes4Schema`, `Bytes32Schema`, `Bytes65Schema`, `BytesMax32Schema`, etc.
- `Hash32Schema` — 32-byte hash.
- `Uint8Schema`, `Uint16Schema`, … `Uint256Schema`, `UintSchema`.
- `RatioSchema` — 0–1 inclusive.

Full list in [@ethernauta/core](/core/overview). If the right primitive is missing, **add it** instead of widening with `any` / `unknown`.

## The type lifecycle

```ts
import * as v from "valibot";
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core";

// 1. Schema is authored.
const sendParamsSchema = v.object({
  to: AddressSchema,
  value: Bytes32Schema,
  input: BytesSchema,
});

// 2. Type is derived.
type SendParams = v.InferOutput<typeof sendParamsSchema>;

declare function build_and_send(_p: SendParams): Promise<string>;

// 3. Boundary parses, interior infers.
function eth_sendTransaction(_params: unknown) {
  const params = v.parse(sendParamsSchema, _params);
  // params: SendParams, fully typed, fully validated
  return build_and_send(params);
}

void eth_sendTransaction;
```

The schema is the value; the type is the shadow.
