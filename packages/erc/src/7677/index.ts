// https://eips.ethereum.org/EIPS/eip-7677
//
// Folder scope: ONLY what ERC-7677 itself defines:
//   - schemas for the paymaster RPC surface (v0.6 + v0.7)
//   - `pm_getPaymasterStubData` / `pm_getPaymasterData` bindings
//   - `apply_to_user_op` — merge the response onto a 4337 op
//
// The bindings take an `Http` from `@ethernauta/transport`
// directly — paymasters are JSON-RPC-over-HTTP endpoints, so
// `http(url)` is the transport with no wrapping layer in between.
//
// 4337 packing / signing is not touched: callers compose
// `apply_to_user_op` upstream of the existing `pack_user_operation`.

export { apply_to_user_op } from "./apply-to-user-op"
export * from "./methods"
export {
  type Context,
  ContextSchema,
  type PaymasterData,
  PaymasterDataSchema,
  type PaymasterDataV06,
  PaymasterDataV06Schema,
  type PaymasterDataV07,
  PaymasterDataV07Schema,
  type PaymasterStubData,
  PaymasterStubDataSchema,
  type PaymasterStubDataV06,
  PaymasterStubDataV06Schema,
  type PaymasterStubDataV07,
  PaymasterStubDataV07Schema,
  type PaymasterUserOperation,
  PaymasterUserOperationSchema,
  type Sponsor,
  SponsorSchema,
} from "./paymaster"
