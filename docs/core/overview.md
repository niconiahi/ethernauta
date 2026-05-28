---
title: "@ethernauta/core"
section: Overview
section_order: 7
order: 1
---

# @ethernauta/core

Primitive Valibot schemas for Ethereum base types: addresses, bytes, hashes, unsigned integers, ratios. **Every other package composes these.** If you find yourself reaching for a regex to validate an address, stop and import from here.

```bash
pnpm add @ethernauta/core
```

```ts
import { AddressSchema, type Address } from "@ethernauta/core";
import * as v from "valibot";

const address = v.parse(AddressSchema, raw_input);
//    ^? Address
```

## Why this package exists

Hard rule 3 in CLAUDE.md: **primitive schemas live in `@ethernauta/core` and nowhere else.** Composing them is fine; redeclaring them inside a feature package is not. Centralizing primitives is what keeps the wire-validation surface auditable.

When a new EIP needs a schema for a "32-byte hash," it imports `Hash32Schema`. It does not write `v.pipe(v.string(), v.regex(/^0x[0-9a-f]{64}$/))`. If the right primitive is missing, the rule is **add it here**, not widen the consumer.

## The catalog

### Addresses

| Schema | Description |
|---|---|
| `AddressSchema` | `0x` + 40 hex chars. EIP-55 checksum-validated. |
| `AddressesSchema` | Array of `AddressSchema`. |

Types: `Address`, `Addresses`.

### Bytes

| Schema | Length | Use |
|---|---|---|
| `ByteSchema` | 1 byte | Single hex byte (`0x` + 2 hex chars). |
| `BytesSchema` | variable | Any `0x`-prefixed hex string. |
| `Bytes4Schema` | 4 bytes | Function selectors. |
| `Bytes8Schema` | 8 bytes | EIP-4337 packed gas / fees fields. |
| `Bytes32Schema` | 32 bytes | Hashes, salts, EVM words. |
| `Bytes48Schema` | 48 bytes | EIP-4844 commitments. |
| `Bytes64Schema` | 64 bytes | BLS-style signatures. |
| `Bytes65Schema` | 65 bytes | ECDSA signatures (`r ‖ s ‖ v`). |
| `Bytes256Schema` | 256 bytes | Bloom filters in receipts. |
| `BytesMax32Schema` | ≤ 32 bytes | Padded EVM args. |

Types: `Byte`, `Bytes`, `Bytes4`, `Bytes8`, `Bytes32`, `Bytes48`, `Bytes64`, `Bytes65`, `Bytes256`, `BytesMax32`.

### Hashes

| Schema | Description |
|---|---|
| `Hash32Schema` | Alias of `bytes32` semantically reserved for keccak hashes. |

Type: `Hash32`.

### Unsigned integers

Every standard EVM uint size has a schema. The wire representation is **hex-encoded** (Ethereum JSON-RPC convention); the parsed JavaScript type is `bigint` (or `number` for the small ones — see the inferred type per row).

| Schema | Range | TS type |
|---|---|---|
| `Uint8Schema` | 0 – 2⁸ − 1 | `number` |
| `Uint16Schema` | 0 – 2¹⁶ − 1 | `number` |
| `Uint24Schema` | 0 – 2²⁴ − 1 | `number` |
| `Uint32Schema` | 0 – 2³² − 1 | `number` |
| `Uint40Schema` | 0 – 2⁴⁰ − 1 | `bigint` |
| `Uint48Schema` | 0 – 2⁴⁸ − 1 | `bigint` |
| `Uint56Schema` | 0 – 2⁵⁶ − 1 | `bigint` |
| `Uint64Schema` | 0 – 2⁶⁴ − 1 | `bigint` |
| `Uint96Schema` | 0 – 2⁹⁶ − 1 | `bigint` |
| `Uint128Schema` | 0 – 2¹²⁸ − 1 | `bigint` |
| `Uint160Schema` | 0 – 2¹⁶⁰ − 1 | `bigint` |
| `Uint192Schema` | 0 – 2¹⁹² − 1 | `bigint` |
| `Uint224Schema` | 0 – 2²²⁴ − 1 | `bigint` |
| `Uint256Schema` | 0 – 2²⁵⁶ − 1 | `bigint` |
| `UintSchema` | any unsigned | `bigint` |

Types: `Uint8`, `Uint16`, … `Uint256`, `Uint`.

### Misc

| Schema | Description |
|---|---|
| `RatioSchema` | A number between 0 and 1 inclusive. |
| `NotFoundSchema` | The sentinel shape for "this RPC returned nothing." |

Types: `Ratio`, `NotFound`.

## Example: composing

```ts
import * as v from "valibot";
import {
  AddressSchema,
  Bytes32Schema,
  Uint256Schema,
} from "@ethernauta/core";

const transferSchema = v.object({
  token: AddressSchema,
  from: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  block_hash: Bytes32Schema,
});

type Transfer = v.InferOutput<typeof transferSchema>;
```

Every field is a primitive from `core`. There's no regex anywhere in the consumer. When EIP-55 checksumming improves or `bytes32`'s wire format changes, this consumer doesn't change.

## Adding a primitive

If you genuinely need a new primitive — say a 17-byte field for a hypothetical new tx type — the right move is to add `bytes17Schema` to `@ethernauta/core`, ship it as a normal export, and import it into your consumer. **Do not widen with `BytesSchema`** and hand-validate later; `parse` would have caught the bug at the boundary, and `BytesSchema` defeats that.

## See also

- [Concepts → Schemas are the types](/concepts/schemas-are-types) — why this rule exists.
- [@ethernauta/utils](/utils/overview) — pure helpers (hex/bytes conversion, RLP).
