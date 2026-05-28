import type { Chain } from "../shared"

export const eip155_1905 = {
  name: "KWALA",
  shortName: "kwala",
  chain: "KWALA",
  icon: "kwala",
  rpc: ["https://rpc-ohio.kwala.network"],
  faucets: [],
  nativeCurrency: {
    name: "KWALA",
    symbol: "KWALA",
    decimals: 18,
  },
  infoURL: "https://kwala.network",
  chainId: 1905,
  networkId: 1905,
} satisfies Chain
