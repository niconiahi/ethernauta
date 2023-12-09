/* eslint no-template-curly-in-string: 0 */
export const ask = {
  name: "Permission",
  shortName: "ASK",
  chain: "ASK",
  rpc: [
    "https://blockchain-api-mainnet.permission.io/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ASK",
    symbol: "ASK",
    decimals: 18,
  },
  infoURL: "https://permission.io/",
  chainId: 222,
  networkId: 2221,
  slip44: 2221,
  status: "deprecated",
} as const