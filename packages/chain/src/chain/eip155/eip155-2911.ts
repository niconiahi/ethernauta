// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2911 = {
  name: "HYCHAIN",
  shortName: "hychain",
  chain: "ETH",
  icon: "hychain",
  rpc: ["https://rpc.hychain.com/http"],
  faucets: [],
  nativeCurrency: {
    name: "TOPIA",
    symbol: "TOPIA",
    decimals: 18,
  },
  infoURL: "https://www.hychain.com",
  chainId: 2911,
  networkId: 2911,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.hychain.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.hychain.com",
      },
    ],
  },
} satisfies Chain
