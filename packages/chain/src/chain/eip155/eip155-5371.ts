// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5371 = {
  name: "Settlus",
  shortName: "setl",
  chain: "ETH",
  rpc: ["https://settlus-mainnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://settlus.org",
  chainId: 5371,
  networkId: 5371,
  explorers: [
    {
      name: "Settlus Mainnet Explorer",
      url: "https://mainnet.settlus.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://settlus-mainnet.bridge.alchemy.com/",
      },
    ],
  },
  status: "active",
} satisfies Chain
