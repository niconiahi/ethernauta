// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_97055 = {
  name: "Tetron Smart Chain",
  shortName: "Tetron",
  chain: "Tetron Mainnet",
  rpc: ["https://rpc.tscscan.org"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Tetron Mainnet",
    symbol: "TSC",
    decimals: 18,
  },
  infoURL: "https://tetronchain.com/",
  chainId: 97055,
  networkId: 97055,
  explorers: [
    {
      name: "Tetron Smart ChainExplorer",
      url: "https://tscscan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
