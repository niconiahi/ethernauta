// https://eips.ethereum.org/EIPS/eip-6492
//
// Folder scope: ONLY what EIP-6492 itself defines (wrapping, unwrapping,
// the magic bytes, the validator bytecode, the universal `verify_hash`).
// Cross-spec compositions (`verify_message_6492`, `verify_typed_data_6492`)
// live in `@ethernauta/crypto`.

export { is_wrapped_signature } from "./is-wrapped-signature"
export { MAGIC_BYTES } from "./magic-bytes"
export {
  type UnwrappedSignature,
  unwrap_signature,
} from "./unwrap-signature"
export { VALIDATOR_BYTECODE } from "./validator-bytecode"
export { verify_hash } from "./verify-hash"
export {
  type WrapSignatureParameters,
  wrap_signature,
} from "./wrap-signature"
