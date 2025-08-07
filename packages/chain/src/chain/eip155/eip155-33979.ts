// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33979 = {
  name: "Funki",
  shortName: "funki",
  chain: "ETH",
  icon: "funki",
  rpc: [
    "https://rpc-mainnet.funkichain.com",
    "wss://rpc-mainnet.funkichain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://funkichain.com",
  chainId: 33979,
  networkId: 33979,
  explorers: [
    {
      name: "Funki Mainnet Explorer",
      url: "https://explorer.funkichain.com",
      standard: "none",
    },
    {
      name: "FunkiScan",
      url: "https://funkiscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
