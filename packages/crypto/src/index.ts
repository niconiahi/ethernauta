// @ethernauta/crypto
//
// Cross-spec signature primitives that compose EIPs that don't individually
// cover the full verification pipeline:
//   - `recover_address`            — pure ECDSA recover (no single EIP owns this)
//   - `verify_message_1271`        — EIP-191 + EIP-1271 (contract-sig fallback)
//   - `verify_typed_data_1271`     — EIP-712 + EIP-1271
//   - `verify_message_6492`        — EIP-191 + EIP-6492 (counterfactual / wrapped)
//   - `verify_typed_data_6492`     — EIP-712 + EIP-6492
//
// The single-EIP primitives stay in their numbered folders:
//   - eip/191    — `build_personal_message`, `personal_sign`
//   - eip/712    — `hash_typed_data`, `typedDataSchema`, `sign_typed_data`
//   - eip/1271   — `MAGIC_VALUE`, `verify_hash`
//   - eip/6492   — `MAGIC_BYTES`, `verify_hash`, wrap/unwrap

export { recover_address } from "./recover"
export {
  type VerifyMessage1271Parameters,
  verify_message_1271,
  verifyMessage1271ParametersSchema,
} from "./verify-message-1271"
export {
  type VerifyMessage6492Parameters,
  verify_message_6492,
  verifyMessage6492ParametersSchema,
} from "./verify-message-6492"
export {
  type VerifySiweMessageFailureReason,
  type VerifySiweMessageParameters,
  type VerifySiweMessageResult,
  verify_siwe_message,
  verifySiweMessageParametersSchema,
} from "./verify-siwe"
export {
  type VerifyTypedData1271Parameters,
  verify_typed_data_1271,
  verifyTypedData1271ParametersSchema,
} from "./verify-typed-data-1271"
export {
  type VerifyTypedData6492Parameters,
  verify_typed_data_6492,
  verifyTypedData6492ParametersSchema,
} from "./verify-typed-data-6492"
