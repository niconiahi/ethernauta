// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7077 = {
  name: "Planq Atlas Testnet",
  shortName: "planq-atlas-testnet",
  chain: "Planq",
  icon: "planq",
  rpc: ["https://evm-rpc-atlas.planq.network"],
  faucets: [],
  nativeCurrency: {
    name: "Planq",
    symbol: "tPLQ",
    decimals: 18,
  },
  infoURL: "https://planq.network",
  chainId: 7077,
  networkId: 7077,
  explorers: [],
} satisfies Chain
