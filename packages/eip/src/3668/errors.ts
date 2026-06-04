// https://eips.ethereum.org/EIPS/eip-3668
//
// Typed failure surface for the CCIP-Read wrapper. Three failure
// modes the consumer may want to discriminate:
//
//   - "max-redirects" — the contract kept reverting with
//     OffchainLookup beyond the configured budget. The last parsed
//     OffchainLookup error is attached so callers can inspect what
//     gateway was being tried.
//   - "gateway-aborted" — the off-chain gateway returned 4xx; the
//     entire lookup is aborted per the spec. The underlying
//     `CcipFetchError` is attached.
//   - "all-gateways-failed" — every gateway returned 5xx. The
//     underlying `CcipAllGatewaysFailedError` is attached.
//
// The 4xx / 5xx cases bubble up from `fetch_ccip` already-typed; the
// wrapper repackages them only when it adds context (e.g. which
// recursion depth they happened at).

import type { OffchainLookupError } from "./schemas"

export type CcipLookupErrorReason =
  | "max-redirects"
  | "gateway-aborted"
  | "all-gateways-failed"

export class CcipLookupError extends Error {
  readonly reason: CcipLookupErrorReason
  readonly lookup: OffchainLookupError | null
  constructor(
    _message: string,
    _reason: CcipLookupErrorReason,
    _lookup: OffchainLookupError | null,
  ) {
    super(_message)
    this.name = "CcipLookupError"
    this.reason = _reason
    this.lookup = _lookup
  }
}
