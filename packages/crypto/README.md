[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/crypto&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/crypto&treeshake=[*])

## Philosophy

This module ships the **cross-spec signature primitives** that compose EIPs that don't individually cover the full verification pipeline. EIP-191 defines a digest format, EIP-712 defines a typed-data digest, EIP-1271 defines an on-chain verifier, EIP-6492 defines a wrapper for counterfactual signatures — none of these on their own answers "is this signature valid for that signer?". This package provides the routers that do.

Single-EIP primitives still live in their numbered folders (`@ethernauta/eip/191`, `@ethernauta/eip/712`, `@ethernauta/eip/1271`, `@ethernauta/eip/6492`). This package is the only place that **combines** them — and the only entry point dapps and the wallet need for crypto.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Verifying a personal message — `verify_message`

Auto-detects whether the signature is a plain EOA ECDSA, an EIP-1271 contract signature, or an EIP-6492 wrapped counterfactual signature, and verifies accordingly.

```ts
import { verify_message } from "@ethernauta/crypto"
import { reader, SEPOLIA_CHAIN_ID } from "./reader"

const valid = await verify_message({
  address: "0xabc…",
  message: "hello",
  signature: "0x…",
})(reader({ chain_id: SEPOLIA_CHAIN_ID }))
```

Two narrower variants are also exported when the caller knows which path to take:

- `verify_message_deployed` — EIP-191 + EIP-1271 (deployed signer, EOA or contract)
- `verify_message_universal` — EIP-191 + EIP-6492 (also accepts counterfactual contract signers)

### Verifying typed data — `verify_typed_data`

Same shape as `verify_message`, applied to EIP-712 typed data.

```ts
import { verify_typed_data } from "@ethernauta/crypto"

const valid = await verify_typed_data({
  address: "0xabc…",
  typed_data: { domain, types, primaryType, message },
  signature: "0x…",
})(reader({ chain_id: SEPOLIA_CHAIN_ID }))
```

Narrow variants: `verify_typed_data_deployed`, `verify_typed_data_universal`.

### Verifying a SIWE message — `verify_siwe_message`

Parses an EIP-4361 message, then delegates to `verify_message`. Returns a tagged result that names the failure reason on rejection.

```ts
import { verify_siwe_message } from "@ethernauta/crypto"

const result = await verify_siwe_message({
  message: siwe_payload,
  signature: "0x…",
})(reader({ chain_id: SEPOLIA_CHAIN_ID }))

if (!result.valid) {
  // result.reason: "parse_failed" | "address_mismatch" | "signature_invalid" | …
}
```

### Pure crypto

```ts
import {
  recover_address,   // ECDSA recover (Yellow Paper Appendix F)
  sign_digest,       // ECDSA sign (RFC 6979, secp256k1)
  signature_to_hex,  // 65-byte canonical wire form r||s||v
} from "@ethernauta/crypto"
```

### BIP-39 / BIP-32 / BIP-44 — key derivation

```ts
import {
  mnemonic_to_seed,        // BIP-39 PBKDF2 (mnemonic → 64-byte seed)
  seed_to_master_key,      // BIP-32 root HDKey
  derive_private_key,      // BIP-44 path on an HDKey
  private_key_to_address,  // curve → keccak → last 20 bytes
} from "@ethernauta/crypto"

const seed = await mnemonic_to_seed("test test test test test test test test test test test junk")
const root = seed_to_master_key(seed)
const private_key = derive_private_key(root, "m/44'/60'/0'/0/0")
const address = private_key_to_address(private_key)
```

### High-level signers

```ts
import {
  personal_sign_message, // EIP-191 digest + sign + serialize
  sign_typed_data,       // EIP-712 digest + sign + serialize
} from "@ethernauta/crypto"

const signature = await personal_sign_message({
  private_key,
  message: "hello",
})
```

### Re-exports

The package re-exports the underlying primitives so consumers (the wallet, dapps) can stay on a single crypto entry point — no direct `@noble/*` or `@scure/*` imports required.

```ts
import { HDKey, keccak_256 } from "@ethernauta/crypto"
import type { RecoveredSignature } from "@ethernauta/crypto"
```
