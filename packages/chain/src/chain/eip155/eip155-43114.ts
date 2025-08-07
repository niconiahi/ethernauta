// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_43114 = {
  name: "Avalanche C-Chain",
  shortName: "avax",
  chain: "AVAX",
  icon: "avax",
  rpc: [
    "https://api.avax.network/ext/bc/C/rpc",
    "https://avalanche-c-chain-rpc.publicnode.com",
    "wss://avalanche-c-chain-rpc.publicnode.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  infoURL: "https://www.avax.network/",
  chainId: 43114,
  networkId: 43114,
  slip44: 9005,
  explorers: [
    {
      name: "Etherscan",
      url: "https://snowscan.xyz",
      standard: "EIP3091",
    },
    {
      name: "Routescan",
      url: "https://snowtrace.io",
      standard: "EIP3091",
    },
    {
      name: "Avascan",
      url: "https://avascan.info",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
