// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_97053 = {
  name: "Tetron Testnet Smart Chain",
  shortName: "TetronTestnet",
  chain: "Tetron Testnet",
  rpc: ["https://test-rpc.tscscan.org"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Tetron Testnet",
    symbol: "TSC",
    decimals: 18,
  },
  infoURL: "https://tetronchain.com/",
  chainId: 97053,
  networkId: 97053,
  explorers: [
    {
      name: "Tetron Explorer",
      url: "https://testnet.tscscan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
