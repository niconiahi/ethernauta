import type { Chain } from "../shared"

export const eip155_167009 = {
  name: "Taiko Hekla (deprecated)",
  shortName: "tko-hekla",
  chain: "ETH",
  icon: "taiko",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://taiko.xyz",
  chainId: 167009,
  networkId: 167009,
  explorers: [],
  status: "deprecated",
} satisfies Chain
