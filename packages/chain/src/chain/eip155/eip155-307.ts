// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_307 = {
  name: "Lovely Network Testnet",
  shortName: "LOVELY-Testnet",
  chain: "Lovely",
  icon: "lovely",
  rpc: ["https://trpc.lovely.network"],
  faucets: ["https://faucet.lovely.network"],
  nativeCurrency: {
    name: "Lovely",
    symbol: "LOVELY",
    decimals: 18,
  },
  infoURL: "https://lovely.network",
  chainId: 307,
  networkId: 307,
  explorers: [
    {
      name: "Lovely Network Testnet",
      url: "https://tscan.lovely.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
