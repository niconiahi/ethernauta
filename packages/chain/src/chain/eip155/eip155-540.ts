import type { Chain } from "../shared"

export const eip155_540 = {
  name: "Pontes-Appia DLT",
  shortName: "appia-540",
  chain: "BESU",
  icon: "ethereum",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "AppiaToken",
    symbol: "ATK",
    decimals: 18,
  },
  infoURL: "https://www.tuosito.it",
  chainId: 540,
  networkId: 540,
  explorers: [],
} satisfies Chain
