// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_75512 = {
  name: "GEEK Verse Mainnet",
  shortName: "GEEK",
  chain: "GEEK",
  rpc: ["https://rpc.geekout-pte.com"],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://www.geekout-pte.com",
  chainId: 75512,
  networkId: 75512,
  explorers: [
    {
      name: "Geek Explorer",
      url: "https://explorer.geekout-pte.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
