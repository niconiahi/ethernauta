import type { Chain } from "../shared"

export const eip155_4160 = {
  name: "Algorand",
  shortName: "algo",
  chain: "ALGO",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Algo",
    symbol: "ALGO",
    decimals: 6,
  },
  infoURL: "https://algorand.co",
  chainId: 4160,
  networkId: 4160,
  slip44: 283,
  explorers: [],
  status: "active",
} satisfies Chain
