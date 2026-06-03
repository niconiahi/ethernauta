// L1 contract addresses live in the deploy registry —
// consumers reach them via `require_deploy_addresses(chain_id)`
// from `@ethernauta/zksync` (re-exported at the package root).
// Thin method bindings stay subpath-only because their
// generated identifiers (`initialize`, `version`, …) collide
// across contracts — consumers reach into
// `@ethernauta/zksync/bridge/<contract>` for those.
//
// Bridge verbs ride `Bridgeable<T>` (one shape for reads and
// mutations alike, with an optional signer at top-level). Verb
// names align with their OP / Arbitrum siblings (`send_eth`,
// `send_erc20`, …); zkSync-only verbs (`claim_failed_deposit`)
// land in slice 4b. Read-only verbs ignore the signer field.
//
// Slice 4a ships `send_eth`; slice 4b adds `send_erc20`,
// `send_message`, `claim_failed_deposit`; slice 4c lands the
// withdraw family + `get_status` + `fetch_message_proof`.

export * from "./bridge"
export * from "./errors"
export * from "./send-eth"
