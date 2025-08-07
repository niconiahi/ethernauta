// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_17735 = {
  name: "Esports Chain",
  shortName: "Esports",
  chain: "ESPT",
  icon: "esports",
  rpc: ["https://esportsblock.org/rpc/"],
  faucets: [],
  nativeCurrency: {
    name: "Esport Token",
    symbol: "ESPT",
    decimals: 18,
  },
  infoURL: "https://esportsblock.org",
  chainId: 17735,
  networkId: 17735,
  explorers: [
    {
      name: "esportsblock_explorer",
      url: "https://esportsblock.org/explorer",
      standard: "none",
    },
  ],
} satisfies Chain
