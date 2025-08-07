// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_814 = {
  name: "Firechain zkEVM",
  shortName: "firechan-zkEVM",
  title: "Firechain zkEVM",
  chain: "Firechain",
  icon: "ethereum",
  rpc: [
    "https://rpc-zkevm.thefirechain.com",
    "https://rpc-zkevm.firestation.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.thefirechain.com/",
  chainId: 814,
  networkId: 814,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://zkevm-bridge-rpc.thefirechain.com",
      },
    ],
  },
} satisfies Chain
