// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4278608 = {
  name: "Arcadia Mainnet",
  shortName: "aip",
  chain: "Arcadia",
  rpc: ["https://arcadia.khalani.network"],
  faucets: [],
  nativeCurrency: {
    name: "AIP",
    symbol: "AIP",
    decimals: 18,
  },
  infoURL: "https://khalani.network",
  chainId: 4278608,
  networkId: 4278608,
  explorers: [
    {
      name: "Arcadia Mainnet Explorer",
      url: "https://explorer.arcadia.khalani.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
