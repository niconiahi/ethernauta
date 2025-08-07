// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_50888 = {
  name: "Erbie Mainnet",
  shortName: "Erbie",
  chain: "Erbie",
  icon: "erbie",
  rpc: ["https://api.erbie.io"],
  faucets: [],
  nativeCurrency: {
    name: "ERB",
    symbol: "ERB",
    decimals: 18,
  },
  infoURL: "https://www.erbie.io",
  chainId: 50888,
  networkId: 50888,
  explorers: [
    {
      name: "Erbie Explorer",
      url: "https://www.erbie.io/explorer",
      standard: "none",
    },
  ],
} satisfies Chain
