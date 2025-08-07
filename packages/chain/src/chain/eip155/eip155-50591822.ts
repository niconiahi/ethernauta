// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_50591822 = {
  name: "Stavanger Public Testnet",
  shortName: "stavanger",
  chain: "stavanger",
  icon: "stavanger",
  rpc: ["https://rpc.stavanger.gateway.fm"],
  faucets: ["https://faucet.stavanger.gateway.fm"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Polygon",
    symbol: "POL",
    decimals: 18,
  },
  infoURL: "https://gateway.fm",
  chainId: 50591822,
  networkId: 50591822,
  explorers: [
    {
      name: "BlockScout",
      url: "https://explorer.stavanger.gateway.fm",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.stavanger.gateway.fm",
      },
    ],
  },
} satisfies Chain
