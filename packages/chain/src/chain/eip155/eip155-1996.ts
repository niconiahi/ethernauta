// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1996 = {
  name: "Sanko",
  shortName: "Sanko",
  chain: "Sanko",
  icon: "sanko",
  rpc: ["https://mainnet.sanko.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "DMT",
    symbol: "DMT",
    decimals: 18,
  },
  infoURL: "https://sanko.xyz/",
  chainId: 1996,
  networkId: 1996,
  explorers: [
    {
      name: "Sanko Explorer",
      url: "https://explorer.sanko.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
