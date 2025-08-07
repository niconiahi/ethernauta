// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_69000 = {
  name: "Animechain Mainnet",
  shortName: "anime",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Animecoin",
    symbol: "ANIME",
    decimals: 18,
  },
  infoURL: "https://www.anime.xyz",
  chainId: 69000,
  networkId: 69000,
  explorers: [
    {
      name: "Animechain explorer",
      url: "https://explorer.anime.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
