// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5330 = {
  name: "Superseed",
  shortName: "sseed",
  chain: "ETH",
  icon: "superseed",
  rpc: [
    "https://mainnet.superseed.xyz",
    "wss://mainnet.superseed.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.superseed.xyz",
  chainId: 5330,
  networkId: 5330,
  slip44: 1,
  explorers: [
    {
      name: "seedscout",
      url: "https://explorer.superseed.xyz",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
