import type { Chain } from "../shared"

export const eip155_60187 = {
  name: "EBLA Testnet",
  shortName: "tebla",
  chain: "EBLA",
  icon: "ebla",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "EBLA",
    symbol: "EBLA",
    decimals: 18,
  },
  infoURL: "https://eblanetwork.com",
  chainId: 60187,
  networkId: 60187,
  status: "incubating",
} satisfies Chain
