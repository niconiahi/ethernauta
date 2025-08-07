// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6985385 = {
  name: "Humanity Protocol",
  shortName: "hp",
  chain: "Humanity",
  rpc: ["https://humanity-mainnet.g.alchemy.com/public"],
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
    name: "H",
    symbol: "H",
    decimals: 18,
  },
  infoURL: "https://humanity.org",
  chainId: 6985385,
  networkId: 6985385,
  explorers: [
    {
      name: "Humanity Mainnet explorer",
      url: "https://humanity-mainnet.explorer.alchemy.com",
      standard: "none",
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
  status: "active",
} satisfies Chain
