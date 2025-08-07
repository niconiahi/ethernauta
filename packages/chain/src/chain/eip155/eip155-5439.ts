// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5439 = {
  name: "Egochain",
  shortName: "egax",
  chain: "EGAX",
  rpc: ["https://mainnet.egochain.org"],
  faucets: [],
  nativeCurrency: {
    name: "EGAX",
    symbol: "EGAX",
    decimals: 18,
  },
  infoURL: "https://docs.egochain.org/",
  chainId: 5439,
  networkId: 5439,
  explorers: [
    {
      name: "egoscan",
      url: "https://egoscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
