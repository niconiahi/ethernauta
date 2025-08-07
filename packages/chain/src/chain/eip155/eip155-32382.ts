// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_32382 = {
  name: "Santiment Intelligence Network",
  shortName: "SANR",
  chain: "Santiment Intelligence Network",
  icon: "sanrchain",
  rpc: ["https://node.sanr.app"],
  faucets: [],
  nativeCurrency: {
    name: "SANR",
    symbol: "SANR",
    decimals: 18,
  },
  infoURL: "https://sanr.app",
  chainId: 32382,
  networkId: 32382,
  explorers: [
    {
      name: "Santiment Intelligence Explorer",
      url: "https://app-explorer-pos.sanr.app",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://sanr.app",
      },
    ],
  },
} satisfies Chain
