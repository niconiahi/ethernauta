// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9981 = {
  name: "Volley Mainnet",
  shortName: "volley-mainnet",
  chain: "Volley",
  icon: "volley",
  rpc: ["https://main-rpc.volleychain.com"],
  faucets: [],
  nativeCurrency: {
    name: "V2X",
    symbol: "V2X",
    decimals: 18,
  },
  infoURL: "https://www.volleychain.com",
  chainId: 9981,
  networkId: 9981,
  explorers: [
    {
      name: "Volley Mainnet Explorer",
      url: "https://volleyscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
