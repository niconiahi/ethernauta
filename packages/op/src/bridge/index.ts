// L1 contract addresses live in the deploy registry —
// consumers reach them via `require_deploy_addresses(chain_id)`
// from `@ethernauta/op` (re-exported at the package root).
// `L2_TO_L1_MESSAGE_PASSER_ADDRESS` is exported here because
// it's an L2 predeploy constant, not a per-chain registry
// entry. Thin method bindings stay subpath-only because their
// generated identifiers (`paused`, `version`, `initialize`,
// …) collide across contracts — consumers reach into
// `@ethernauta/op/bridge/<contract>` for those.

export { L2_TO_L1_MESSAGE_PASSER_ADDRESS } from "./l2-to-l1-message-passer"

// Verbs (one wildcard per file).
export * from "./send-eth"
