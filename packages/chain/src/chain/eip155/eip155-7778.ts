// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7778 = {
  name: "Orenium Mainnet Protocol",
  shortName: "ore",
  chain: "ORE",
  icon: "ore",
  rpc: [
    "https://validator-mainnet.orenium.org",
    "https://rpc-oracle-mainnet.orenium.org",
    "https://portalmainnet.orenium.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ORENIUM",
    symbol: "ORE",
    decimals: 18,
  },
  infoURL: "https://orenium.org",
  chainId: 7778,
  networkId: 7778,
  slip44: 1,
  explorers: [
    {
      name: "ORE Mainnet Explorer",
      url: "https://oreniumscan.org",
      standard: "none",
    },
  ],
} satisfies Chain
