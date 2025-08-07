// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_12324 = {
  name: "L3X Protocol",
  shortName: "l3x",
  chain: "L3X",
  icon: "l3x",
  rpc: ["https://rpc-mainnet.l3x.com"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://l3x.com",
  chainId: 12324,
  networkId: 12324,
  explorers: [
    {
      name: "L3X Mainnet Explorer",
      url: "https://explorer.l3x.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-42161",
    bridges: [
      {
        url: "https://bridge.arbitrum.io",
      },
    ],
  },
} satisfies Chain
