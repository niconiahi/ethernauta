// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5050 = {
  name: "Skate Mainnet",
  shortName: "skate",
  chain: "ETH",
  icon: "skate",
  rpc: ["https://rpc.skatechain.org/"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.skatechain.org/",
  chainId: 5050,
  networkId: 5050,
  explorers: [
    {
      name: "Skate Explorer",
      url: "https://scan.skatechain.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "",
      },
    ],
  },
  status: "active",
} satisfies Chain
