// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3645 = {
  name: "iChain Testnet",
  shortName: "ISLAMIT",
  chain: "iChain Testnet",
  icon: "iChain",
  rpc: ["https://istanbul.ichainscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "ISLAMICOIN",
    symbol: "ISLAMI",
    decimals: 18,
  },
  infoURL: "https://islamicoin.finance",
  chainId: 3645,
  networkId: 3645,
  explorers: [
    {
      name: "iChainscan",
      url: "https://test.ichainscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
