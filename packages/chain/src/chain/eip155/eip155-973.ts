// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_973 = {
  name: "Palm Smart Chain",
  shortName: "PalmChain",
  title: "Palm Smart Chain",
  chain: "Palm",
  rpc: ["https://rpc.palmsmartchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "PALM",
    symbol: "PALM",
    decimals: 18,
  },
  infoURL: "https://palmsmartchain.io",
  chainId: 973,
  networkId: 973,
  explorers: [
    {
      name: "Palm Smart Chain Explorer",
      url: "https://explorer.palmsmartchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
