import type { Chain } from "@ethernauta/chain"

export type GasFamily =
  | "1559"
  | "op-stack"
  | "arbitrum"
  | "zksync"

// Keyed by chainId as string — JS Numbers lose precision past 2^53.
const OP_STACK = new Set<string>([
  "10", // Optimism
  "8453", // Base
  "34443", // Mode
  "7777777", // Zora
  "5000", // Mantle
  "480", // World Chain
  "1868", // Soneium
  "1135", // Lisk
])

const ARBITRUM = new Set<string>([
  "42161", // Arbitrum One
  "42170", // Arbitrum Nova
])

const ZKSYNC = new Set<string>([
  "324", // zkSync Era mainnet
  "300", // zkSync Sepolia
])

export function gas_family(chain: Chain): GasFamily {
  const key = String(chain.chainId)
  if (OP_STACK.has(key)) return "op-stack"
  if (ARBITRUM.has(key)) return "arbitrum"
  if (ZKSYNC.has(key)) return "zksync"
  return "1559"
}
