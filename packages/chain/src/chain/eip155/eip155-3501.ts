// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3501 = {
  name: "JFIN Chain",
  shortName: "JFIN",
  chain: "JFIN",
  rpc: ["https://rpc.jfinchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "JFIN Coin",
    symbol: "JFIN",
    decimals: 18,
  },
  infoURL: "https://jfinchain.com",
  chainId: 3501,
  networkId: 3501,
  explorers: [
    {
      name: "JFIN Chain Explorer",
      url: "https://exp.jfinchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
