// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_13746 = {
  name: "Game7 Testnet",
  shortName: "g7t",
  title: "Game7 Testnet",
  chain: "Game7",
  icon: "game7testnet",
  rpc: [
    "https://testnet-rpc.game7.io",
    "wss://testnet-rpc.game7.io",
    "https://testnet-rpc.game7.build",
    "wss://testnet-rpc.game7.build",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "TG7T",
    symbol: "TG7T",
    decimals: 18,
  },
  infoURL: "https://game7.io",
  chainId: 13746,
  networkId: 13746,
  explorers: [
    {
      name: "Blockscout",
      url: "https://testnet.game7.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
