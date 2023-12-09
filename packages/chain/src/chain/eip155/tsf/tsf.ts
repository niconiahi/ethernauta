/* eslint no-template-curly-in-string: 0 */
export const tsf = {
  name: "Teslafunds",
  shortName: "tsf",
  chain: "TSF",
  rpc: [
    "https://tsfapi.europool.me",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Teslafunds Ether",
    symbol: "TSF",
    decimals: 18,
  },
  infoURL: "https://teslafunds.io",
  chainId: 1856,
  networkId: 1,
} as const
