// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8047 = {
  name: "BOAT Mainnet",
  shortName: "boat",
  title: "BOAT Mainnet",
  chain: "BOAT",
  icon: "boat",
  rpc: ["https://rpc0.come.boat/"],
  faucets: [],
  nativeCurrency: {
    name: "Best Of All Time Token",
    symbol: "BOAT",
    decimals: 18,
  },
  infoURL: "https://come.boats",
  chainId: 8047,
  networkId: 8047,
  slip44: 1,
  explorers: [
    {
      name: "BOAT Mainnet Explorer",
      url: "https://scan.come.boats",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
