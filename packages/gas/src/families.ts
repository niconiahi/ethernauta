import type { Chain } from "@ethernauta/chain"

export type GasFamily =
  | "1559"
  | "op-stack"
  | "arbitrum"
  | "zksync"

// Per-family chainId lists declared `as const` so the literal-union
// types `OpStackChainId` / `ArbitrumChainId` / `ZksyncChainId` track
// the same runtime values that drive `gas_family`. The conditional
// `FamilyForChainId<Id>` is what lets `calculate_gas(chain, …)` infer
// the matching parameter shape from `chain.chainId` alone — no `kind`
// field on the call.
//
// EIP-155 chainIds fit in a JS Number for every L2 we care about
// here (max is 7_777_777, well under 2^53). The historical `Set<string>`
// representation existed for forward-compat with EVM-incompatible
// namespaces that mint enormous IDs; for the EVM L2 families this
// number-keyed shape is sufficient and gives us the literal types.
export const OP_STACK_CHAIN_IDS = [
  10, // Optimism
  8453, // Base
  34443, // Mode
  7777777, // Zora
  5000, // Mantle
  480, // World Chain
  1868, // Soneium
  1135, // Lisk
] as const
export type OpStackChainId =
  (typeof OP_STACK_CHAIN_IDS)[number]

export const ARBITRUM_CHAIN_IDS = [
  42161, // Arbitrum One
  42170, // Arbitrum Nova
] as const
export type ArbitrumChainId =
  (typeof ARBITRUM_CHAIN_IDS)[number]

export const ZKSYNC_CHAIN_IDS = [
  324, // zkSync Era mainnet
  300, // zkSync Sepolia
] as const
export type ZksyncChainId =
  (typeof ZKSYNC_CHAIN_IDS)[number]

const OP_STACK = new Set<number>(OP_STACK_CHAIN_IDS)
const ARBITRUM = new Set<number>(ARBITRUM_CHAIN_IDS)
const ZKSYNC = new Set<number>(ZKSYNC_CHAIN_IDS)

export function gas_family(chain: Chain): GasFamily {
  if (OP_STACK.has(chain.chainId)) return "op-stack"
  if (ARBITRUM.has(chain.chainId)) return "arbitrum"
  if (ZKSYNC.has(chain.chainId)) return "zksync"
  return "1559"
}

// Compile-time mirror of `gas_family`. Conditional resolves
// to the literal family for any chain whose `chainId` is a
// literal type (the `satisfies Chain` exports preserve it);
// widens to `GasFamily` for arbitrary `Chain` values.
export type FamilyForChainId<Id extends number> =
  Id extends OpStackChainId
    ? "op-stack"
    : Id extends ArbitrumChainId
      ? "arbitrum"
      : Id extends ZksyncChainId
        ? "zksync"
        : "1559"
