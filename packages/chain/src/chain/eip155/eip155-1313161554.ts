// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1313161554 = {
  name: "Aurora Mainnet",
  shortName: "aurora",
  chain: "NEAR",
  rpc: [
    "https://mainnet.aurora.dev",
    "https://aurora.drpc.org",
    "wss://aurora.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://aurora.dev",
  chainId: 1313161554,
  networkId: 1313161554,
  explorers: [
    {
      name: "Aurora Explorer",
      url: "https://explorer.aurora.dev",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
