// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1125 = {
  name: "Taker Chain Mainnet",
  shortName: "taker",
  chain: "Taker",
  icon: "taker",
  rpc: ["https://rpc-mainnet.taker.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Taker",
    symbol: "TAKER",
    decimals: 18,
  },
  infoURL: "https://www.taker.xyz",
  chainId: 1125,
  networkId: 1125,
  explorers: [
    {
      name: "TakerScan",
      url: "https://explorer.taker.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
