import type { Chain } from "../shared"

export const eip155_1243 = {
  name: "ARC Mainnet",
  shortName: "ARC",
  chain: "ARC",
  icon: "arc",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "ARC",
    symbol: "ARC",
    decimals: 18,
  },
  infoURL: "https://archiechain.io/",
  chainId: 1243,
  networkId: 1243,
  explorers: [],
  status: "deprecated",
} satisfies Chain
