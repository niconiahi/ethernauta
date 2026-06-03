// L1 contract addresses live in the deploy registry —
// consumers reach them via `require_deploy_addresses(chain_id)`
// from `@ethernauta/op` (re-exported at the package root).
// `L2_TO_L1_MESSAGE_PASSER_ADDRESS` is exported here because
// it's an L2 predeploy constant, not a per-chain registry
// entry. Thin method bindings stay subpath-only because their
// generated identifiers (`paused`, `version`, `initialize`,
// …) collide across contracts — consumers reach into
// `@ethernauta/op/bridge/<contract>` for those.
//
// Bridge verbs ride `Bridgeable<T>` (one shape for reads and
// mutations alike, with an optional signer at top-level). The
// eight mutation verbs share their names with their
// Arbitrum / zkSync siblings (`send_eth`, `send_erc20`,
// `send_message`, `start_withdraw_*`, `prove_withdraw`,
// `execute_withdraw`); read-only verbs (`get_status`,
// `fetch_message_proof`) ignore the signer field.

export * from "./bridge"
export * from "./compute-deposit-source-hash"
export * from "./decode-deposit-tx"
export * from "./derive-l2-tx-hashes-from-l1-receipt"
export * from "./encode-deposit-tx"
export * from "./errors"
export * from "./execute-withdraw"
export * from "./get-status"
export { L2_TO_L1_MESSAGE_PASSER_ADDRESS } from "./l2-to-l1-message-passer"
export * from "./message-proof"
export * from "./prove-withdraw"
export * from "./send-erc20"
export * from "./send-eth"
export * from "./send-message"
export * from "./start-withdraw-erc20"
export * from "./start-withdraw-eth"
export * from "./start-withdraw-message"
