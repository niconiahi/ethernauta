/* eslint no-template-curly-in-string: 0 */
export const seele = {
  name: "Seele Mainnet",
  shortName: "Seele",
  chain: "Seele",
  rpc: [
    "https://rpc.seelen.pro/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Seele",
    symbol: "Seele",
    decimals: 18,
  },
  infoURL: "https://seelen.pro/",
  chainId: 186,
  networkId: 186,
  explorers: [
    {
      name: "seeleview",
      url: "https://seeleview.net",
      standard: "none",
    },
  ],
} as const
