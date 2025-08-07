// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_60808 = {
  name: "BOB",
  shortName: "bob",
  chain: "ETH",
  icon: "bob",
  rpc: [
    "https://rpc.gobob.xyz",
    "wss://rpc.gobob.xyz",
    "https://bob-mainnet.public.blastapi.io",
    "wss://bob-mainnet.public.blastapi.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://gobob.xyz",
  chainId: 60808,
  networkId: 60808,
  explorers: [
    {
      name: "bobscout",
      url: "https://explorer.gobob.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://app.gobob.xyz",
      },
    ],
  },
  status: "active",
} satisfies Chain
