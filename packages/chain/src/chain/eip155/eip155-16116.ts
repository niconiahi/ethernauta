// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_16116 = {
  name: "DeFiVerse Mainnet",
  shortName: "DFV",
  chain: "DeFiVerse",
  icon: "defiverse",
  rpc: ["https://rpc.defi-verse.org/"],
  faucets: [],
  nativeCurrency: {
    name: "Oasys",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://defi-verse.org",
  chainId: 16116,
  networkId: 16116,
  explorers: [
    {
      name: "DeFiVerse Explorer",
      url: "https://scan.defi-verse.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-248",
  },
} satisfies Chain
