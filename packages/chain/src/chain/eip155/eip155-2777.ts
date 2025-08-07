// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2777 = {
  name: "GM Network Mainnet",
  shortName: "gmnetwork-mainnet",
  chain: "GM Network Mainnet",
  rpc: ["https://rpc.gmnetwork.ai"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://gmnetwork.ai",
  chainId: 2777,
  networkId: 2777,
  explorers: [
    {
      name: "GM Network Mainnet Explorer",
      url: "https://scan.gmnetwork.ai",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
