// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_997 = {
  name: "5ireChain Thunder Testnet",
  shortName: "T5ire",
  chain: "5ireChain",
  icon: "5ireChain",
  rpc: ["https://rpc.testnet.5ire.network"],
  faucets: ["https://testnet.5irescan.io/faucet"],
  nativeCurrency: {
    name: "5ire Testnet Token",
    symbol: "T5IRE",
    decimals: 18,
  },
  infoURL: "https://5ire.org",
  chainId: 997,
  networkId: 997,
  explorers: [
    {
      name: "5ireChain Testnet Explorer",
      url: "https://testnet.5irescan.io",
      standard: "none",
    },
  ],
} satisfies Chain
