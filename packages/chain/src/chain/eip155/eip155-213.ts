// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_213 = {
  name: "B2 Hub Mainnet",
  shortName: "B2Hub-mainnet",
  chain: "B2",
  icon: "bsquare",
  rpc: ["https://hub-rpc.bsquared.network"],
  faucets: [],
  nativeCurrency: {
    name: "BSquared Token",
    symbol: "B2",
    decimals: 18,
  },
  infoURL: "https://www.bsquared.network",
  chainId: 213,
  networkId: 213,
  explorers: [
    {
      name: "B2 Hub Mainnet Explorer",
      url: "https://hub-explorer.bsquared.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
