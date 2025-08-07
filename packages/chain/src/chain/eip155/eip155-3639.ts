// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3639 = {
  name: "iChain Network",
  shortName: "ISLAMI",
  chain: "iChain",
  icon: "iChain",
  rpc: ["https://rpc.ichainscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "ISLAMICOIN",
    symbol: "ISLAMI",
    decimals: 18,
  },
  infoURL: "https://islamicoin.finance",
  chainId: 3639,
  networkId: 3639,
  explorers: [
    {
      name: "iChainscan",
      url: "https://ichainscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
