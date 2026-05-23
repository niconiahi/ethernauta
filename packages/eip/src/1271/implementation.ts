// https://eips.ethereum.org/EIPS/eip-1271
//
// Folder scope: ONLY what EIP-1271 itself defines:
//   - `MAGIC_VALUE` (0x1626ba7e — bytes4 returned by isValidSignature)
//   - `verify_hash` (the `isValidSignature(bytes32, bytes)` contract call)
//
// Cross-spec compositions live in `@ethernauta/crypto`:
//   - `recover_address` — pure ECDSA recover (Yellow Paper, not 1271)
//   - `verify_message_deployed` — composes EIP-191 + EIP-1271 + EOA fallback
//   - `verify_typed_data_deployed` — composes EIP-712 + EIP-1271 + EOA fallback
//   - the `verify_message` / `verify_typed_data` routers

export { MAGIC_VALUE } from "./magic-value"
export { verify_hash } from "./verify-hash"
