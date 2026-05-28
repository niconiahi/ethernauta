// https://eips.ethereum.org/EIPS/eip-4361
//
// Folder scope: EIP-4361 SIWE format primitives (build, parse, nonce).
// The cross-spec verifier (`verify_siwe_message`, which combines parse +
// EIP-191 + EIP-1271 or EIP-6492 signature check) lives in
// `@ethernauta/crypto`.

export { build_siwe_message } from "./build"
export { generate_siwe_nonce } from "./nonce"
export {
  is_siwe_message,
  parse_siwe_message,
  type SiweMessage,
  SiweMessageSchema,
} from "./parse"
