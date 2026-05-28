import type { Chain } from "../shared"

export const eip155_60186 = {
  name: "EBLA Mainnet",
  shortName: "ebla",
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
  chainId: 60186,
  networkId: 60186,
  status: "incubating",
} satisfies Chain
