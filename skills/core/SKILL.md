---
name: core
description: Catalog of the @ethernauta/core primitive Valibot schemas. Every other package (eip, erc, ens, eth, abi, transport, wallet) builds on top of these. Read this before introducing any new validated type — the chances are the schema you need is already here, and silently re-defining it is the first sign that the work is off-track.
---

# Core primitives — @ethernauta/core

`@ethernauta/core` is the schema floor of the monorepo. It exists because every EIP, ERC, and ENSIP paper describes its inputs and outputs in terms of the same handful of base types: 20-byte addresses, fixed-width byte strings, unsigned integers, 32-byte hashes. Instead of redeclaring those at each call site we declare them **once**, in `packages/core/src/`, as Valibot schemas; everything else imports and composes them.

Source of truth: [base-types.yaml from the Ethereum execution-apis spec](https://github.com/ethereum/execution-apis/blob/main/src/schemas/base-types.yaml). When a new primitive is needed, mirror the spec — do not invent your own regex.

## Shape of every primitive

Every file in `packages/core/src/` follows the same shape — three things, in this order:

```ts
import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isAddress(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9,a-f,A-F]{40}$/.test(input)
  )
}
export const addressSchema =
  custom<`0x${string}`>(isAddress)
export type Address = InferOutput<typeof addressSchema>
```

- a typed `is<X>` predicate (lowercase camelCase, takes `unknown`, returns `boolean`),
- a `<x>Schema` exported via `valibot`'s `custom<` `0x${string}` `>`,
- a type alias derived with `InferOutput`.

This is the **only** allowed shape for a primitive in core. See `packages/core/src/address.ts:1-13` as the canonical example.

## The catalog

All entries re-exported from `packages/core/src/index.ts`. Import via `@ethernauta/core`.

| Schema | Type | Pattern | Use it for |
|---|---|---|---|
| `addressSchema` | `Address` | `/^0x[0-9,a-f,A-F]{40}$/` | 20-byte Ethereum addresses (mixed-case allowed; we do not enforce EIP-55 here) |
| `addressesSchema` | `Addresses` | `array(addressSchema)` | Lists of addresses (e.g. account list responses) |
| `byteSchema` | `Byte` | `/^0x([0-9,a-f,A-F]?){1,2}$/` | A single byte (`0x00`–`0xff`) |
| `bytesSchema` | `Bytes` | `/^0x[0-9a-f]*$/` | Variable-length lowercase hex byte string (calldata, signatures, signed-tx envelopes) |
| `bytes4Schema` | `Bytes4` | `/^0x[0-9a-f]{8}$/` | 4-byte function selectors (`keccak256(signature)[0:4]`) |
| `bytes8Schema` | `Bytes8` | `/^0x[0-9a-f]{16}$/` | 8-byte fields (nonce in block header, mix hash chunks) |
| `bytes32Schema` | `Bytes32` | `/^0x[0-9a-f]{64}$/` | 32-byte words: ENS namehash nodes, storage slots, salts |
| `bytes48Schema` | `Bytes48` | `/^0x[0-9a-f]{96}$/` | BLS12-381 public keys (consensus layer) |
| `bytes65Schema` | `Bytes65` | `/^0x[0-9a-f]{130}$/` | Canonical secp256k1 signatures `r ‖ s ‖ v` |
| `bytes256Schema` | `Bytes256` | `/^0x[0-9a-f]{512}$/` | Bloom filters (256 bytes) |
| `bytesMax32Schema` | `BytesMax32` | `/^0x[0-9a-f]{0,64}$/` | Anything ≤ 32 bytes (small payload fields) |
| `hash32Schema` | `Hash32` | `/^0x[0-9a-f]{64}$/` | A 32-byte digest. Use this when meaning is "hash" (block hash, tx hash, message hash); use `bytes32Schema` when meaning is "an arbitrary 32-byte slot" |
| `uintSchema` | `Uint` | `/^0x([1-9a-f]+[0-9a-f]*|0)$/` | Hex-quantity unsigned integer with no leading zeros |
| `uint8Schema` | `Uint8` | `/^0x([0-9a-fA-F]{2})$/` | A byte interpreted as a number |
| `uint64Schema` | `Uint64` | `/^0x([1-9a-f]+[0-9a-f]{0,15})\|0$/` | Up to 16 hex digits, useful for chain ids, nonces, block numbers |
| `uint256Schema` | `Uint256` | `/^0x[0-9a-f]{1,64}$/` | Up to 32 bytes — token amounts, balances, fees |
| `notFoundSchema` | `NotFound` | `null_()` | Distinguishes "absent" responses from JSON-RPC (e.g. `eth_getTransactionByHash` returning `null`) |
| `ratioSchema` | `Ratio` | `number 0..1` | Probabilities, percentages-as-fraction. Not hex |

### `hash32Schema` vs `bytes32Schema`

Same regex (`/^0x[0-9a-f]{64}$/`), different intent.

- Use `hash32Schema` when the value *means* a hash — a digest of something. Examples: `Hash32` block hash on a header, the input to `verify_hash` in EIP-1271, an ENS namehash node.
- Use `bytes32Schema` when the value *means* an arbitrary 32-byte slot — a storage slot, a salt, a domain separator field.

The runtime check is identical; the type alias carries the meaning forward to the reader.

## The rules — keep `core` boring

1. **Spec mirroring only.** A schema lives in `core` if and only if it appears in a base-types document somewhere upstream (Ethereum execution-apis, EIP body, ENSIP body). If you would not be able to point at a paragraph in a spec to justify the regex, the schema does not belong here. Put it in the consuming package.
2. **No domain types.** `TypedDataDomain`, `EthernautaRequest`, `Transaction`, `VerifyHashParameters` are *compositions* of primitives and belong to their owning package (`@ethernauta/eip/712`, `@ethernauta/wallet/utils/event`, etc.). They must not leak back into `core`.
3. **No transport- or wallet-aware schemas.** `core` cannot import `transport`, `wallet`, `eth`, `eip`, `erc`, `ens`. Check the dependency graph: `packages/core/package.json` has only `valibot` as a peer.
4. **Lowercase hex by default.** Most regexes accept only `[0-9a-f]`. The exceptions (`addressSchema`, `byteSchema`, `uint8Schema`) accept mixed-case because mainnet addresses and JSON-RPC quantities often arrive that way. Do not add new mixed-case regexes without that justification.
5. **Always derive the type from the schema.** `export type X = InferOutput<typeof xSchema>`. Never write `interface X` or a manual `type X = { ... }` for something that has a schema. See the `conventions` skill.

## Building on top of core

Every consumer follows the same pattern: import primitive schemas, compose them with `object`/`tuple`/`union` from valibot, derive the type with `InferOutput`, validate at the boundary with `parse`.

```ts
// packages/eip/src/1271/verify-hash.ts:33-40
import {
  addressSchema,
  bytesSchema,
  hash32Schema,
} from "@ethernauta/core"
import { type InferOutput, object, parse } from "valibot"

export const verifyHashParametersSchema = object({
  address: addressSchema,
  hash: hash32Schema,
  signature: bytesSchema,
})
export type VerifyHashParameters = InferOutput<
  typeof verifyHashParametersSchema
>
```

```ts
// packages/erc/src/20/methods/transfer.ts:30-34 (positional|named parameter union)
const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({ to: addressSchema, value: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>
```

```ts
// packages/eip/src/712/typed-data.ts:21-29 (composed object with mixed primitives)
export const typedDataDomainSchema = object({
  name: optional(string()),
  version: optional(string()),
  chainId: optional(
    union([bigint(), number(), uint256Schema]),
  ),
  verifyingContract: optional(addressSchema),
  salt: optional(bytes32Schema),
})
```

When you are about to type a function parameter, the first question is **"is this composed of core primitives?"**. If yes, compose them — do not reinvent. If a primitive you need is genuinely missing from `core`, add it to `core` following the canonical shape above, then export it from `index.ts`. Do not inline a regex inside a feature package.

## When to extend core

You may add a new file in `packages/core/src/` only if all four are true:

- It mirrors a primitive from an upstream spec (link the spec at the top of the file).
- It will be reused by at least two consuming packages.
- It has no domain semantics — it is just a shape.
- The shape can be expressed as a single `custom<>` predicate, a `pipe` of valibot refinements, or a thin alias (`array(addressSchema)`).

Anything else lives in the package that needs it.
