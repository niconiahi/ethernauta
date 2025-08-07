// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4613 = {
  name: "VERY Mainnet",
  shortName: "very",
  title: "VERY Mainnet",
  chain: "VERY Mainnet",
  icon: "very",
  rpc: ["https://rpc.verylabs.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "VERY",
    symbol: "VERY",
    decimals: 18,
  },
  infoURL: "https://www.verylabs.io/",
  chainId: 4613,
  networkId: 4613,
  explorers: [
    {
      name: "VERY explorer",
      url: "https://www.veryscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
