/* eslint no-template-curly-in-string: 0 */
export const ceri = {
  name: "Cerium Testnet",
  shortName: "ceri",
  chain: "CAU",
  icon: "canxium",
  rpc: [
    "https://cerium-rpc.canxium.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Canxium",
    symbol: "CAU",
    decimals: 18,
  },
  infoURL: "https://canxium.org",
  chainId: 30103,
  networkId: 30103,
  explorers: [
    {
      name: "canxium explorer",
      url: "https://cerium-explorer.canxium.net",
      standard: "none",
    },
  ],
} as const