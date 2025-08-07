// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_92278 = {
  name: "Miracle Chain",
  shortName: "MIRACLE",
  chain: "MIRACLE",
  icon: "miracle",
  rpc: ["https://rpc.miracleplay.io"],
  faucets: [],
  nativeCurrency: {
    name: "Miracle Play Token",
    symbol: "MPT",
    decimals: 18,
  },
  infoURL: "https://miracleplay.gg",
  chainId: 92278,
  networkId: 92278,
  explorers: [
    {
      name: "Miracle Chain Explorer",
      url: "https://explorer.miracleplay.io",
      standard: "none",
    },
  ],
} satisfies Chain
