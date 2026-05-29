// https://eips.ethereum.org/EIPS/eip-3668
//
// Folder scope: ONLY what EIP-3668 itself defines:
//   - `OffchainLookupError` + `CcipResponse` schemas
//   - `parse_offchain_lookup_revert` — decode the custom revert
//   - `substitute_url`               — {sender} / {data} template
//   - `build_callback_calldata`      — callback selector + abi.encode
//   - `fetch_ccip`                   — the URL-iteration GET/POST loop
//   - `eth_call_ccip`                — wrapper around `eth_call`
//   - `CcipLookupError`              — typed failure surface
//
// Wallet / ENS / paymaster integration is composed by consumers
// (e.g. `@ethernauta/ens` routes its resolver `eth_call` through
// `eth_call_ccip` — that composition is not this folder's job).

export {
  type CcipResponse,
  CcipResponseSchema,
  type OffchainLookupError,
  OffchainLookupErrorSchema,
} from "./schemas"
export { build_callback_calldata } from "./build-callback-calldata"
export {
  type CcipLookupErrorReason,
  CcipLookupError,
} from "./errors"
export {
  type EthCallCcipOptions,
  EthCallCcipOptionsSchema,
  type EthCallCcipParameters,
  EthCallCcipParametersSchema,
  eth_call_ccip,
} from "./eth-call-ccip"
export {
  CcipAllGatewaysFailedError,
  CcipFetchError,
  type FetchCcipArgs,
  FetchCcipArgsSchema,
  fetch_ccip,
} from "./fetch-ccip"
export { parse_offchain_lookup_revert } from "./parse-offchain-lookup-revert"
export { substitute_url } from "./substitute-url"
