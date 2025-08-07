// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_146 = {
  name: "Sonic Mainnet",
  shortName: "sonic",
  chain: "sonic",
  icon: "sonic",
  rpc: [
    "https://rpc.soniclabs.com",
    "https://sonic-rpc.publicnode.com",
    "wss://sonic-rpc.publicnode.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  infoURL: "https://soniclabs.com",
  chainId: 146,
  networkId: 146,
  explorers: [
    {
      name: "sonic",
      url: "https://explorer.soniclabs.com",
      standard: "none",
    },
  ],
} satisfies Chain
