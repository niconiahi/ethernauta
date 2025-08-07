// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33710 = {
  name: "R5 Network Testnet",
  shortName: "tr5",
  chain: "r5testnet",
  icon: "r5",
  rpc: ["https://rpc-testnet.r5.network"],
  faucets: [],
  nativeCurrency: {
    name: "Test R5",
    symbol: "TR5",
    decimals: 18,
  },
  infoURL: "https://r5.network",
  chainId: 33710,
  networkId: 33710,
  explorers: [
    {
      name: "R5 Explorer",
      url: "https://explorer-testnet.r5.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
