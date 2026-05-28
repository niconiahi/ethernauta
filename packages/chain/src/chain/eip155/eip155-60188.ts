import type { Chain } from "../shared"

export const eip155_60188 = {
  name: "EBLA Devnet",
  shortName: "debla",
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
  chainId: 60188,
  networkId: 60188,
  status: "incubating",
} satisfies Chain
