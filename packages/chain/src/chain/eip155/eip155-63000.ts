// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_63000 = {
  name: "eSync Network Mainnet",
  shortName: "esync-mainnet",
  title: "eSync Network Mainnet",
  chain: "ECS",
  icon: "esync",
  rpc: [
    "https://rpc.esync.network",
    "https://rpc.ecredits.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "eCredits",
    symbol: "ECS",
    decimals: 18,
  },
  infoURL: "https://esync.network",
  chainId: 63000,
  networkId: 63000,
  explorers: [
    {
      name: "eSync Network Mainnet Explorer",
      url: "https://explorer.esync.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
