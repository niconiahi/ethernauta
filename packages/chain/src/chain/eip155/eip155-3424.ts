// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3424 = {
  name: "EVOLVE Mainnet",
  shortName: "EVOm",
  chain: "EVO",
  icon: "evolveIcon",
  rpc: ["https://rpc.evoexplorer.com"],
  faucets: [],
  nativeCurrency: {
    name: "Evolve",
    symbol: "EVO",
    decimals: 18,
  },
  infoURL: "https://evolveblockchain.io",
  chainId: 3424,
  networkId: 3424,
  explorers: [
    {
      name: "Evolve Mainnet Explorer",
      url: "https://evoexplorer.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
