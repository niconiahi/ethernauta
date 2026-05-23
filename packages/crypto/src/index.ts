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
//
// The single-EIP primitives stay in their numbered folders:
//   - eip/191    — `build_personal_message`, `personal_sign`
//   - eip/712    — `hash_typed_data`, `typedDataSchema`, `sign_typed_data`
//   - eip/1271   — `MAGIC_VALUE`, `verify_hash`
//   - eip/6492   — `MAGIC_BYTES`, `verify_hash`, wrap/unwrap

export { recover_address } from "./recover"
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
