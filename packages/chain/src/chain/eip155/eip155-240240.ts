// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_240240 = {
  name: "Studio Testnet",
  shortName: "sto",
  chain: "STO",
  icon: "studio",
  rpc: [
    "https://rpc.studio-blockchain.com",
    "wss://ws.studio-blockchain.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Studio Token",
    symbol: "STO",
    decimals: 18,
  },
  infoURL: "https://studio-blockchain.com",
  chainId: 240240,
  networkId: 240240,
  explorers: [
    {
      name: "Studio Scan",
      url: "https://studio-scan.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
