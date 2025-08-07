// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9025 = {
  name: "Nexa Mainnet Block",
  shortName: "Nexa",
  chain: "Nexa Mainnet",
  icon: "nexaChain",
  rpc: [
    "https://rpc-nodes.nexablockscan.io",
    "wss://wss-nodes.nexablockscan.io",
    "https://rpc-nodes-delta.nexablockscan.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Nexa Mainnet Token",
    symbol: "NEXB",
    decimals: 18,
  },
  infoURL: "https://www.nexablock.io",
  chainId: 9025,
  networkId: 9025,
  explorers: [
    {
      name: "Nexablock Mainnet Explorer",
      url: "https://nexablockscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
