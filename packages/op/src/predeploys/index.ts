// Address constants only. Method bindings live behind subpath imports:
//   import { getL1Fee } from "@ethernauta/op/predeploys/gas-price-oracle"
// Method names like `version` and `paused` are duplicated across
// predeploys, so the per-folder subpath is the only conflict-free way
// to bring them in.
export * from "./gas-price-oracle/address"
export * from "./l1-block/address"
export * from "./l1-fee-vault/address"
export * from "./l2-cross-domain-messenger/address"
export * from "./l2-standard-bridge/address"
export * from "./sequencer-fee-vault/address"
