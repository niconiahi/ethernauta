// Address constants only. Method bindings live behind subpath imports:
//   import { arbBlockNumber } from "@ethernauta/arbitrum/precompiles/arb-sys"
// Method names like `version` are duplicated across precompiles,
// so the per-folder subpath is the only conflict-free way to bring
// them in.

export * from "./arb-address-table/address"
export * from "./arb-aggregator/address"
export * from "./arb-bls/address"
export * from "./arb-debug/address"
export * from "./arb-function-table/address"
export * from "./arb-gas-info/address"
export * from "./arb-info/address"
export * from "./arb-native-token-manager/address"
export * from "./arb-owner/address"
export * from "./arb-owner-public/address"
export * from "./arb-retryable-tx/address"
export * from "./arb-statistics/address"
export * from "./arb-sys/address"
export * from "./arb-wasm/address"
export * from "./arb-wasm-cache/address"
export * from "./node-interface/address"
