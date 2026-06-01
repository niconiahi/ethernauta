// Address lookups cherry-picked per contract (each has a
// unique `require_*_address` name; no collisions). Thin
// method bindings stay subpath-only because their
// generated identifiers (`paused`, `version`, `initialize`,
// …) collide across contracts — consumers reach into
// `@ethernauta/op/bridge/<contract>` for those.

export { require_anchor_state_registry_address } from "./anchor-state-registry"
export { require_dispute_game_factory_address } from "./dispute-game-factory"
export { require_l1_standard_bridge_address } from "./l1-standard-bridge"
export { L2_TO_L1_MESSAGE_PASSER_ADDRESS } from "./l2-to-l1-message-passer"
export { require_optimism_portal_address } from "./optimism-portal"

// Verbs (one wildcard per file).
export * from "./send-eth"
