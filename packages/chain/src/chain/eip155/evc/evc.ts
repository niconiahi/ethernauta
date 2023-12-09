/* eslint no-template-curly-in-string: 0 */
export const evc = {
  name: "Evrice Network",
  shortName: "EVC",
  chain: "EVC",
  rpc: [
    "https://meta.evrice.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Evrice",
    symbol: "EVC",
    decimals: 18,
  },
  infoURL: "https://evrice.com",
  chainId: 1010,
  networkId: 1010,
  slip44: 1020,
} as const
