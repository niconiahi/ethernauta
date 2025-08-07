// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_308 = {
  name: "Furtheon",
  shortName: "furtheon",
  chain: "Furtheon Network",
  rpc: ["https://rpc.furtheon.org"],
  faucets: [],
  nativeCurrency: {
    name: "Furtheon",
    symbol: "FTH",
    decimals: 18,
  },
  infoURL: "https://furtheon.org/",
  chainId: 308,
  networkId: 308,
  explorers: [
    {
      name: "furthscan",
      url: "http://furthscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
