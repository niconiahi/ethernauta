// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11888 = {
  name: "Santiment Intelligence Network DEPRECATED",
  shortName: "SANold",
  chain: "Santiment Intelligence Network DEPRECATED",
  icon: "sanrchain",
  rpc: ["https://sanrchain-node.santiment.net"],
  faucets: [],
  nativeCurrency: {
    name: "SANold",
    symbol: "SANold",
    decimals: 18,
  },
  infoURL: "https://sanr.app",
  chainId: 11888,
  networkId: 11888,
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
  status: "deprecated",
} satisfies Chain
