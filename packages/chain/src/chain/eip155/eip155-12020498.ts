// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_12020498 = {
  name: "Lummio Network",
  shortName: "lummio",
  chain: "Lummio Network",
  rpc: ["https://rpc.lummio.net"],
  faucets: [],
  nativeCurrency: {
    name: "Lummio Reward Points",
    symbol: "LRPO",
    decimals: 18,
  },
  infoURL: "https://lummio.net",
  chainId: 12020498,
  networkId: 12020498,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.lummio.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
