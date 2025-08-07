// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7225878 = {
  name: "Saakuru Mainnet",
  shortName: "saakuru",
  chain: "Saakuru",
  icon: "saakuru",
  rpc: ["https://rpc.saakuru.network"],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://saakuru.network",
  chainId: 7225878,
  networkId: 7225878,
  explorers: [
    {
      name: "saakuru-explorer",
      url: "https://explorer.saakuru.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
