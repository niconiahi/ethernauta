// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_44474237230 = {
  name: "Deriw Devnet",
  shortName: "deriw-dev",
  title: "Deriw Devnet",
  chain: "Deriw Devnet",
  icon: "deriw",
  rpc: ["https://rpc.dev.deriw.com"],
  faucets: [],
  nativeCurrency: {
    name: "Deriw",
    symbol: "Der",
    decimals: 18,
  },
  infoURL: "https://deriw.com",
  chainId: 44474237230,
  networkId: 44474237230,
  explorers: [
    {
      name: "Deriw Explorer",
      url: "https://explorer.dev.deriw.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-421614",
    bridges: [
      {
        url: "https://bridge.arbitrum.io",
      },
    ],
  },
} satisfies Chain
