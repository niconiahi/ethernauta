// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_763373 = {
  name: "Ink Sepolia",
  shortName: "inksepolia",
  chain: "ETH",
  rpc: [
    "https://rpc-gel-sepolia.inkonchain.com",
    "wss://ws-gel-sepolia.inkonchain.com",
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
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://inkonchain.com/",
  chainId: 763373,
  networkId: 763373,
  explorers: [
    {
      name: "Ink Sepolia Explorer",
      url: "https://explorer-sepolia.inkonchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
