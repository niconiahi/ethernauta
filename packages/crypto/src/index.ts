// @ethernauta/crypto
//
// Cross-spec signature primitives that compose EIPs that don't individually
// cover the full verification pipeline.
//
// Personal-message (EIP-191) verification — three variants in verify-message.ts:
//   - `verify_message_deployed`     EIP-191 + EIP-1271 (on-chain signer)
//   - `verify_message_universal`    EIP-191 + EIP-6492 (also counterfactual)
//   - `verify_message`              router; picks one based on the
//                                   EIP-6492 magic-bytes suffix
//
// Typed-data (EIP-712) verification — three variants in verify-typed-data.ts,
// same shape:
//   - `verify_typed_data_deployed`
//   - `verify_typed_data_universal`
//   - `verify_typed_data`
//
// SIWE (EIP-4361) verification — verify-siwe.ts:
//   - `verify_siwe_message`         EIP-4361 parse + delegate to verify_message
//
// Pure crypto:
//   - `recover_address`             ECDSA recover (Yellow Paper Appendix F).
//   - `sign_digest`                 ECDSA sign (RFC 6979 over secp256k1).
//   - `signature_to_hex`            65-byte canonical wire form (r||s||v).
//   - `mnemonic_to_seed`            BIP-39 PBKDF2.
//   - `seed_to_master_key`          BIP-32 root HDKey.
//   - `derive_private_key`          BIP-44 path on an HDKey.
//   - `private_key_to_address`      curve → keccak → last 20 bytes.
//   - `personal_sign_message`       EIP-191 digest + sign + serialize.
//   - `sign_typed_data`             EIP-712 digest + sign + serialize.
//
// Re-exports so consumers (the wallet, dapps) can stay on a
// single crypto entry point — no direct `@noble/*` or
// `@scure/*` imports required.
//
// The single-EIP primitives stay in their numbered folders:
//   - eip/191    — `build_personal_message`, `personal_sign`
//   - eip/712    — `hash_typed_data`, `typedDataSchema`, `sign_typed_data`
//   - eip/1271   — `MAGIC_VALUE`, `verify_hash`
//   - eip/6492   — `MAGIC_BYTES`, `verify_hash`, wrap/unwrap

// `keccak_256` and `RecoveredSignature` are transitional
// re-exports for `wallet/utils/sign-transaction.ts` until
// EIP-1559 transaction signing moves into
// `@ethernauta/eip/1559` (Phase 2). Once that lands, these
// two lines disappear and the wallet's last `@noble` link
// goes with them.
export { keccak_256 } from "@noble/hashes/sha3"
export type { RecoveredSignature } from "@noble/secp256k1"

export { HDKey } from "@scure/bip32"
export { derive_private_key } from "./derive-private-key"
export { mnemonic_to_seed } from "./mnemonic-to-seed"
export { personal_sign_message } from "./personal-sign-message"
export { private_key_to_address } from "./private-key-to-address"
export { recover_address } from "./recover"
export { seed_to_master_key } from "./seed-to-master-key"
export { sign_digest } from "./sign-digest"
export { sign_typed_data } from "./sign-typed-data"
export { signature_to_hex } from "./signature-to-hex"
export {
  type VerifyMessageParameters,
  verify_message,
  verify_message_deployed,
  verify_message_universal,
  verifyMessageParametersSchema,
} from "./verify-message"
export {
  type VerifySiweMessageFailureReason,
  type VerifySiweMessageParameters,
  type VerifySiweMessageResult,
  verify_siwe_message,
  verifySiweMessageParametersSchema,
} from "./verify-siwe"
export {
  type VerifyTypedDataParameters,
  verify_typed_data,
  verify_typed_data_deployed,
  verify_typed_data_universal,
  verifyTypedDataParametersSchema,
} from "./verify-typed-data"
