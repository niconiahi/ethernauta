import type { Chain } from "../shared"

export const eip155_654 = {
  name: "Kalichain",
  shortName: "kalichainMainnet",
  chain: "Kalichain",
  icon: "kalichain",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "kalis",
    symbol: "KALIS",
    decimals: 18,
  },
  infoURL: "https://kalichain.com",
  chainId: 654,
  networkId: 654,
  explorers: [],
  status: "deprecated",
} satisfies Chain
