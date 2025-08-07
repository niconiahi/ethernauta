// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2187 = {
  name: "Game7",
  shortName: "g7",
  title: "Game7",
  chain: "Game7",
  icon: "game7",
  rpc: [
    "https://mainnet-rpc.game7.io",
    "wss://mainnet-rpc.game7.io",
    "https://mainnet-rpc.game7.build",
    "wss://mainnet-rpc.game7.build",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "G7",
    symbol: "G7",
    decimals: 18,
  },
  infoURL: "https://game7.io/",
  chainId: 2187,
  networkId: 2187,
  explorers: [
    {
      name: "Blockscout",
      url: "https://mainnet.game7.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
