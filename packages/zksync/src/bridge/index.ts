// L1 contract addresses live in the deploy registry —
// consumers reach them via `require_deploy_addresses(chain_id)`
// from `@ethernauta/zksync` (re-exported at the package root).
// Thin method bindings stay subpath-only because their
// generated identifiers (`initialize`, `version`, `withdraw`,
// …) collide across contracts — consumers reach into
// `@ethernauta/zksync/bridge/<contract>` for those.
//
// L2 predeploy addresses (`L2_BASE_TOKEN_ADDRESS`,
// `L2_ASSET_ROUTER_ADDRESS`) are fixed across every zkSync-
// family L2 and re-exported at the bridge root for convenience
// — the surrounding method bindings stay subpath-only for the
// same identifier-collision reason.
//
// Bridge verbs ride `Bridgeable<T>` (one shape for reads and
// mutations alike, with an optional signer at top-level). Verb
// names align with their OP / Arbitrum siblings (`send_eth`,
// `send_erc20`, `start_withdraw_*`, `execute_withdraw`,
// `get_status`, …); zkSync-only verbs (`claim_failed_deposit`)
// land in slice 4b. Read-only verbs ignore the signer field.
//
// Slice 4a ships `send_eth`; slice 4b adds `send_erc20`,
// `send_message`, `claim_failed_deposit`; slice 4c lands the
// withdraw family (`start_withdraw_eth`, `start_withdraw_erc20`,
// `start_withdraw_message`), the proof builder
// (`fetch_message_proof` + `MessageProofSchema`),
// `execute_withdraw`, and the deposit/withdraw `get_status`
// union.

export * from "./bridge"
export * from "./claim-failed-deposit"
export * from "./decode-l1-message-sent"
export * from "./errors"
export * from "./execute-withdraw"
export * from "./failed-deposit-proof"
export * from "./get-status"
export { L2_ASSET_ROUTER_ADDRESS } from "./l2-asset-router/address"
export { L2_BASE_TOKEN_ADDRESS } from "./l2-base-token/address"
export * from "./message-proof"
export * from "./send-erc20"
export * from "./send-eth"
export * from "./send-message"
export * from "./start-withdraw-erc20"
export * from "./start-withdraw-eth"
export * from "./start-withdraw-message"
