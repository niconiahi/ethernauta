// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19516 = {
  name: "SEC Mainnet",
  shortName: "SECm",
  chain: "SEC",
  icon: "secIcon",
  rpc: ["https://rpc.secexplorer.io"],
  faucets: [],
  nativeCurrency: {
    name: "SEP",
    symbol: "SEP",
    decimals: 18,
  },
  infoURL: "https://smartenergychain.org",
  chainId: 19516,
  networkId: 19516,
  explorers: [
    {
      name: "SEC Mainnet Explorer",
      url: "https://secexplorer.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
