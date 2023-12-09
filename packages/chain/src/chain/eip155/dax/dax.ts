/* eslint no-template-curly-in-string: 0 */
export const dax = {
  name: "DAX CHAIN",
  shortName: "dax",
  chain: "DAX",
  rpc: [
    "https://rpc.prodax.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Prodax",
    symbol: "DAX",
    decimals: 18,
  },
  infoURL: "https://prodax.io/",
  chainId: 142,
  networkId: 142,
} as const
