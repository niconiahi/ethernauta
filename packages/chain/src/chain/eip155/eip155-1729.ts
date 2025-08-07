// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1729 = {
  name: "Reya Network",
  shortName: "reya",
  chain: "Reya",
  rpc: [
    "https://rpc.reya.network",
    "wss://ws.reya.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://reya.network",
  chainId: 1729,
  networkId: 1729,
  explorers: [
    {
      name: "Reya Network Explorer",
      url: "https://explorer.reya.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
