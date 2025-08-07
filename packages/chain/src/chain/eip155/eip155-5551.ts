// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5551 = {
  name: "Nahmii 2 Mainnet",
  shortName: "Nahmii",
  chain: "Nahmii",
  icon: "nahmii",
  rpc: ["https://l2.nahmii.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://nahmii.io",
  chainId: 5551,
  networkId: 5551,
  explorers: [
    {
      name: "Nahmii 2 Mainnet Explorer",
      url: "https://explorer.n2.nahmii.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://n2.bridge.nahmii.io",
      },
    ],
  },
  status: "active",
} satisfies Chain
