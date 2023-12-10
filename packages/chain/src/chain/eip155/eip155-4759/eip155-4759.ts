import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_4759: Chain = {
  name: "MEVerse Chain Testnet",
  shortName: "TESTMEV",
  chain: "MEVerse",
  icon: "meverse",
  rpc: [
    "https://rpc.meversetestnet.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MEVerse",
    symbol: "MEV",
    decimals: 18,
  },
  infoURL: "https://www.meverse.sg",
  chainId: 4759,
  networkId: 4759,
  explorers: [
    {
      name: "MEVerse Chain Testnet Explorer",
      url: "https://testnet.meversescan.io",
      standard: "none",
    },
  ],
}
