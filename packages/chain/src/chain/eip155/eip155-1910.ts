import type { Chain } from "../shared"

export const eip155_1910 = {
  name: "KWALA Devnet",
  shortName: "kwala-devnet",
  chain: "KWALA",
  icon: "kwala",
  rpc: ["https://dev-kwala-rpc-node.p2eppl.com"],
  faucets: [],
  nativeCurrency: {
    name: "KWALA",
    symbol: "KWALA",
    decimals: 18,
  },
  infoURL: "https://kwala.network",
  chainId: 1910,
  networkId: 1910,
} satisfies Chain
