// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_165279 = {
  name: "Eclat Mainnet",
  shortName: "ECLAT",
  chain: "Eclat",
  icon: "eclat",
  rpc: ["https://mainnet-rpc.eclatscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "Eclat",
    symbol: "ECLAT",
    decimals: 18,
  },
  infoURL: "https://eclatscan.com",
  chainId: 165279,
  networkId: 165279,
  explorers: [
    {
      name: "Eclat Mainnet Explorer",
      url: "https://eclatscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
