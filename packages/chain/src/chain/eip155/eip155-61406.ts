// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_61406 = {
  name: "KaiChain",
  shortName: "kec",
  chain: "KaiChain",
  rpc: ["https://mainnet-rpc.kaichain.net"],
  faucets: [],
  nativeCurrency: {
    name: "KaiChain Native Token",
    symbol: "KEC",
    decimals: 18,
  },
  infoURL: "https://kaichain.net",
  chainId: 61406,
  networkId: 61406,
  explorers: [
    {
      name: "KaiChain Explorer",
      url: "https://explorer.kaichain.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
