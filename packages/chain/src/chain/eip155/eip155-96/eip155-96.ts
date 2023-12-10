import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_96: Chain = {
  name: "Bitkub Chain",
  shortName: "bkc",
  chain: "BKC",
  icon: "bkc",
  rpc: [
    "https://rpc.bitkubchain.io",
    "wss://wss.bitkubchain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Bitkub Coin",
    symbol: "KUB",
    decimals: 18,
  },
  infoURL: "https://www.bitkubchain.com/",
  chainId: 96,
  networkId: 96,
  explorers: [
    {
      name: "Bitkub Chain Explorer",
      url: "https://bkcscan.com",
      standard: "none",
    },
  ],
  redFlags: [
    "reusedChainId",
  ],
}
