import type { Chain } from "../shared"

export const eip155_1244 = {
  name: "ARC Testnet",
  shortName: "TARC",
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
  chainId: 1244,
  networkId: 1244,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} satisfies Chain
