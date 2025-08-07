// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_543210 = {
  name: "ZERO Network",
  shortName: "zero-network",
  chain: "ZERONetwork",
  icon: "zero",
  rpc: ["https://rpc.zerion.io/v1/zero"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.zero.network",
  chainId: 543210,
  networkId: 543210,
  explorers: [
    {
      name: "ZERO Network Explorer",
      url: "https://explorer.zero.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.zero.network",
      },
    ],
  },
} satisfies Chain
