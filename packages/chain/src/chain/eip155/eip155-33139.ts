// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33139 = {
  name: "ApeChain",
  shortName: "apechain",
  chain: "apechain",
  rpc: ["https://rpc.apechain.com"],
  faucets: [],
  nativeCurrency: {
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
  },
  infoURL: "https://apechain.com",
  chainId: 33139,
  networkId: 33139,
  explorers: [
    {
      name: "ApeChain Explorer",
      url: "https://apescan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
