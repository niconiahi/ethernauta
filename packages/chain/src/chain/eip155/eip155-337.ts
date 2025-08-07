// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_337 = {
  name: "R5 Network",
  shortName: "r5",
  chain: "r5",
  icon: "r5",
  rpc: ["https://rpc.r5.network"],
  faucets: [],
  nativeCurrency: {
    name: "R5",
    symbol: "R5",
    decimals: 18,
  },
  infoURL: "https://r5.network",
  chainId: 337,
  networkId: 337,
  explorers: [
    {
      name: "R5 Explorer",
      url: "https://explorer.r5.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
