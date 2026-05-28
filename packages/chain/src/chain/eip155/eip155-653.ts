import type { Chain } from "../shared"

export const eip155_653 = {
  name: "Kalichain Testnet",
  shortName: "kalichain",
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
  chainId: 653,
  networkId: 653,
  explorers: [],
  status: "deprecated",
} satisfies Chain
