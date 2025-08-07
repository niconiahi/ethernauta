// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5424 = {
  name: "edeXa Mainnet",
  shortName: "edx",
  chain: "edeXa",
  icon: "edexa",
  rpc: [
    "https://rpc.edexa.network",
    "https://rpc.edexa.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "edeXa",
    symbol: "EDX",
    decimals: 18,
  },
  infoURL: "https://edexa.network/",
  chainId: 5424,
  networkId: 5424,
  slip44: 1,
  explorers: [
    {
      name: "edexa-mainnet-explorer",
      url: "https://explorer.edexa.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
