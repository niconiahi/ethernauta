// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_526916 = {
  name: "DoCoin Community Chain",
  shortName: "DoCoin",
  title: "DoCoin Community Chain",
  chain: "DoCoin",
  rpc: ["https://rpc.docoin.shop"],
  faucets: [],
  nativeCurrency: {
    name: "DO",
    symbol: "DCT",
    decimals: 18,
  },
  infoURL: "https://docoin.network",
  chainId: 526916,
  networkId: 526916,
  explorers: [
    {
      name: "DoCoin Community Chain Explorer",
      url: "https://explorer.docoin.shop",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
