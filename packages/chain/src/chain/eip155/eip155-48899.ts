import type { Chain } from "../shared"

export const eip155_48899 = {
  name: "Zircuit Testnet",
  shortName: "zircuit-testnet",
  chain: "Zircuit Testnet",
  icon: "zircuit",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.zircuit.com/",
  chainId: 48899,
  networkId: 48899,
  explorers: [],
  status: "deprecated",
} satisfies Chain
