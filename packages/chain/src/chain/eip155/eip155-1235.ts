// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1235 = {
  name: "ITX Mainnet",
  shortName: "itx",
  chain: "ITX",
  rpc: ["https://rpc.itxchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "ITX",
    symbol: "ITX",
    decimals: 18,
  },
  infoURL: "https://explorer.itxchain.com",
  chainId: 1235,
  networkId: 1235,
  explorers: [
    {
      name: "ITX Mainnet Explorer (Blockscout)",
      url: "https://explorer.itxchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
