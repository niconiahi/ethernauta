import type { Chain } from "../shared"

export const eip155_5042 = {
  name: "Arc",
  shortName: "arc-mainnet",
  chain: "Arc",
  icon: "arcnetwork",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  infoURL: "https://arc.network",
  chainId: 5042,
  networkId: 5042,
  explorers: [],
} satisfies Chain
