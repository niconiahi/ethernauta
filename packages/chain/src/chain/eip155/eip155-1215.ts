// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1215 = {
  name: "ADF Chain",
  shortName: "ADF",
  chain: "ADF Chain",
  icon: "addfillmain",
  rpc: ["https://mainnet.adftechnology.com/"],
  faucets: [],
  nativeCurrency: {
    name: "ADDFILL",
    symbol: "ADF",
    decimals: 18,
  },
  infoURL: "https://www.adfstarworld.com/",
  chainId: 1215,
  networkId: 1215,
  explorers: [
    {
      name: "ADF explorer",
      url: "https://explorer.adftechnology.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
