// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_154 = {
  name: "Redbelly Network TGE",
  shortName: "rbn-tge",
  chain: "RBN",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Redbelly Network Coin",
    symbol: "RBNT",
    decimals: 18,
  },
  infoURL: "https://redbelly.network",
  chainId: 154,
  networkId: 154,
} satisfies Chain
