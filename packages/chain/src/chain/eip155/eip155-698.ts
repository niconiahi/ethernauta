// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_698 = {
  name: "Matchain",
  shortName: "Matchain",
  chain: "Matchain",
  icon: "matchain",
  rpc: ["https://rpc.matchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  infoURL: "https://www.matchain.io",
  chainId: 698,
  networkId: 698,
  slip44: 714,
  explorers: [
    {
      name: "Matchscan",
      url: "https://matchscan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-56",
    bridges: [
      {
        url: "https://bnb-bridge.matchain.io",
      },
    ],
  },
} satisfies Chain
