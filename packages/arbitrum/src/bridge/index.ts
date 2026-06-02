// L1 contract addresses live in the deploy registry —
// consumers reach them via `require_deploy_addresses(chain_id)`
// from `@ethernauta/arbitrum` (re-exported at the package
// root). Thin method bindings stay subpath-only because their
// generated identifiers (`paused`, `version`, `initialize`, …)
// collide across contracts — consumers reach into
// `@ethernauta/arbitrum/bridge/<contract>` for those.
//
// Bridge verbs ride `Bridgeable<T>` (one shape for reads and
// mutations alike, with an optional signer at top-level). Verb
// names align with their OP / zkSync siblings (`send_eth`,
// `send_erc20`, …); Arbitrum-only verbs (`redeem_retryable`,
// `cancel_retryable`) land in slice 3b. Read-only verbs ignore
// the signer field.
//
// Slice 3a ships `send_eth` only; siblings land in 3b/3c.

export * from "./bridge"
export * from "./errors"
export * from "./send-eth"
