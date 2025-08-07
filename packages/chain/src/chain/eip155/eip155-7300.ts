// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7300 = {
  name: "XPLA Verse",
  shortName: "XPLAVERSE",
  chain: "XPLA Verse",
  icon: "xpla_verse",
  rpc: ["https://rpc-xpla-verse.xpla.dev"],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://www.xpla.io",
  chainId: 7300,
  networkId: 7300,
  explorers: [
    {
      name: "XPLA Verse Explorer",
      url: "https://explorer-xpla-verse.xpla.dev",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-248",
  },
} satisfies Chain
