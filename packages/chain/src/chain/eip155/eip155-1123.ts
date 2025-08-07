// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1123 = {
  name: "B2 Testnet",
  shortName: "B2-testnet",
  title: "B2 Testnet",
  chain: "Habitat",
  icon: "bsquare",
  rpc: [
    "https://b2-testnet.alt.technology",
    "https://rpc.ankr.com/b2_testnet",
    "https://testnet-rpc.bsquared.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://www.bsquared.network",
  chainId: 1123,
  networkId: 1123,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet-explorer.bsquared.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1113",
  },
} satisfies Chain
