import type { Chain } from "../shared"

export const eip155_1995 = {
  name: "edeXa Testnet",
  shortName: "edxt",
  chain: "edeXa",
  icon: "edexa",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "edeXa",
    symbol: "tEDX",
    decimals: 18,
  },
  infoURL: "https://edexa.network/",
  chainId: 1995,
  networkId: 1995,
  slip44: 1,
  explorers: [],
} satisfies Chain
