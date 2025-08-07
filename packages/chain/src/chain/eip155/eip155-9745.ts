// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9745 = {
  name: "Plasma Mainnet",
  shortName: "plasma-mainnet",
  chain: "Plasma",
  icon: "plasma",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Plasma",
    symbol: "XPL",
    decimals: 18,
  },
  infoURL: "https://plasma.to",
  chainId: 9745,
  networkId: 9745,
  explorers: [],
} satisfies Chain
