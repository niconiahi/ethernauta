// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_690 = {
  name: "Redstone",
  shortName: "redstone",
  chain: "ETH",
  icon: "redstone",
  rpc: [
    "https://rpc.redstonechain.com",
    "wss://rpc.redstonechain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://redstone.xyz",
  chainId: 690,
  networkId: 690,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.redstone.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://redstone.xyz/deposit",
      },
    ],
  },
} satisfies Chain
