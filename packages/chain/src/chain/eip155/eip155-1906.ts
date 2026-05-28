import type { Chain } from "../shared"

export const eip155_1906 = {
  name: "KWALA Stagenet",
  shortName: "kwala-stagenet",
  chain: "KWALA",
  icon: "kwala",
  rpc: ["https://qa-kwala-rpc-node.p2eppl.com"],
  faucets: [],
  nativeCurrency: {
    name: "KWALA",
    symbol: "KWALA",
    decimals: 18,
  },
  infoURL: "https://kwala.network",
  chainId: 1906,
  networkId: 1906,
} satisfies Chain
