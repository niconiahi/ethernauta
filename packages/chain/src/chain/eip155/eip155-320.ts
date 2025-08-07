// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_320 = {
  name: "ZKcandy Mainnet",
  shortName: "zkcandy",
  chain: "ETH",
  icon: "zkcandymainnet",
  rpc: ["https://rpc.zkcandy.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://zkcandy.io/",
  chainId: 320,
  networkId: 320,
  explorers: [
    {
      name: "ZKcandy Block Explorer",
      url: "https://explorer.zkcandy.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.zkcandy.io/",
      },
    ],
  },
} satisfies Chain
