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
// Slice 3a ships `send_eth`; slice 3b adds `send_erc20`,
// `send_message`, `redeem_retryable`, `cancel_retryable`;
// slice 3c lands the withdraw family + `get_status` +
// `fetch_message_proof`.

export * from "./bridge"
export * from "./cancel-retryable"
export * from "./errors"
export * from "./execute-withdraw"
export * from "./get-status"
export * from "./message-proof"
export * from "./redeem-retryable"
export * from "./send-erc20"
export * from "./send-eth"
export * from "./send-message"
export * from "./start-withdraw-erc20"
export * from "./start-withdraw-eth"
export * from "./start-withdraw-message"
