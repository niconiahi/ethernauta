---
title: "@ethernauta/crypto"
section: Overview
section_order: 7
order: 8
---

# @ethernauta/crypto

Universal signature verification across EIP-191, EIP-712, EIP-1271, and EIP-6492 — plus the underlying ECDSA / hashing / key-derivation primitives.

```bash
pnpm add @ethernauta/crypto
```

This is the package that lets you verify a signature **without caring** whether it was produced by an EOA, a deployed smart-account, or a counterfactual (not-yet-deployed) smart-account. The "universal" verifiers walk the full hierarchy.

## Verifying messages (EIP-191)

```ts
import { verify_message } from "@ethernauta/crypto";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const signer = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const signature = parse(BytesSchema, "0x");

const ok = await verify_message({
  address: signer,
  message: "Hello, world",
  signature,
})(reader({ chain_id: CHAIN_ID }));
```

`verify_message` tries EOA recovery, then EIP-1271 if the address has code. `verify_message_deployed` is EIP-1271-only; `verify_message_universal` adds EIP-6492 (works for not-yet-deployed accounts).

## Verifying typed data (EIP-712)

```ts
import { verify_typed_data } from "@ethernauta/crypto";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema } from "@ethernauta/core";
import type { TypedData } from "@ethernauta/eip/712";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const signer = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const signature = parse(BytesSchema, "0x");
const typedData: TypedData = {
  domain: { name: "Example", version: "1", chainId: 1 },
  types: { Mail: [{ name: "from", type: "address" }] },
  primaryType: "Mail",
  message: { from: signer },
};

const ok = await verify_typed_data({
  address: signer,
  typedData,
  signature,
})(reader({ chain_id: CHAIN_ID }));
```

Same pattern: `verify_typed_data` is the convenience entry, `verify_typed_data_deployed` and `verify_typed_data_universal` are the lower tiers.

## Verifying SIWE (EIP-4361)

```ts
import { verify_siwe_message } from "@ethernauta/crypto";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const message = "example.com wants you to sign in...";
const signature = parse(BytesSchema, "0x");
const domain = "example.com";
const nonce = "abc123";

const result = await verify_siwe_message({
  message,
  signature,
  expected: { domain, nonce },
})(reader({ chain_id: CHAIN_ID }));

if (result.ok) {
  console.log("address:", result.fields.address);
} else {
  console.log("reason:", result.reason);
  // ↑ VerifySiweMessageFailureReason
}
```

Parses + verifies + cross-checks the embedded domain, URI, chain ID, and nonce. Failure modes are typed (`VerifySiweMessageFailureReason`) so the rejection branch can be acted on programmatically.

## Signing primitives

For when the dapp owns a private key (server-side flows, key-derived accounts, tests):

```ts
import {
  sign_digest,
  signature_to_hex,
} from "@ethernauta/crypto";

const digest = new Uint8Array(32);
const private_key = new Uint8Array(32);

const signature = sign_digest(digest, private_key);
const hex = signature_to_hex(signature);
```

| Helper | Purpose |
|---|---|
| `sign_digest` | Sign a 32-byte digest with an ECDSA private key. |
| `sign_typed_data` | Hash + sign an EIP-712 typed-data payload. |
| `personal_sign_message` | EIP-191 `personal_sign` over a UTF-8 message. |
| `signature_to_hex` | Pack `{ r, s, v }` into `0x` + 130 hex chars. |

## Recovery

```ts
import { recover_address } from "@ethernauta/crypto";
import { Hash32Schema, Bytes65Schema } from "@ethernauta/core";
import { parse } from "valibot";

const digest = parse(Hash32Schema, "0x" + "00".repeat(32));
const signature = parse(Bytes65Schema, "0x" + "00".repeat(65));

const address = recover_address(digest, signature);
```

`recover_address` is the inverse of `sign_digest` — given the digest that was signed and the signature, return the address whose private key signed it.

## Key derivation (BIP-32 / 39 / 44)

```ts
import {
  mnemonic_to_seed,
  seed_to_master_key,
  derive_private_key,
  private_key_to_address,
  HDKey,
} from "@ethernauta/crypto";

const seed = mnemonic_to_seed("twelve word mnemonic ...");
const master: HDKey = seed_to_master_key(seed);
const account = derive_private_key(master, "m/44'/60'/0'/0/0");
const address = private_key_to_address(account);
```

Used by the wallet's vault to derive addresses from the encrypted mnemonic. Exposed in `crypto` because off-wallet flows (test fixtures, hardware-wallet adapters, key-rotation scripts) need the same primitives.

`HDKey` is re-exported from `@scure/bip32`.

## Hashing

```ts
import { keccak_256 } from "@ethernauta/crypto";

const bytes = new Uint8Array([0x01, 0x02, 0x03]);
const hash = keccak_256(bytes);  // → Uint8Array(32)
```

Re-export of `@noble/hashes/sha3`'s `keccak_256`. Hashing primitives don't need their own package — they pass through here for ergonomic import.

## Why this split from `@ethernauta/eip/1271` / `eip/6492`

The `@ethernauta/eip/<n>/` packages own the **wire-shape** definitions and the magic constants of each spec. They expose `verify_hash` per EIP — a method scoped to that EIP's exact verification flow.

`@ethernauta/crypto` owns the **cross-EIP** verification — the function that knows how to fall through 191 → 1271 → 6492 in the right order for "verify this signature came from this address." That's a separate concern from any one EIP.

The split satisfies hard rule 11 in CLAUDE.md (numbered-standard logic stays in its numbered folder) while still giving consumers a single import for the common "just verify this" use case.

## See also

- [EIP-191](/eips/191) — personal_sign wire format.
- [EIP-712](/eips/712) — typed-data wire format.
- [EIP-1271](/eips/1271) — smart-contract signature validation.
- [EIP-6492](/eips/6492) — counterfactual signature wrapping.
- [EIP-4361](/eips/4361) — Sign-In with Ethereum.
