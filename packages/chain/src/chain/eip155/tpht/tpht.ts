/* eslint no-template-curly-in-string: 0 */
export const tpht = {
  name: "Lightstreams Testnet",
  shortName: "tpht",
  chain: "PHT",
  rpc: [
    "https://node.sirius.lightstreams.io",
  ],
  faucets: [
    "https://discuss.lightstreams.network/t/request-test-tokens",
  ],
  nativeCurrency: {
    name: "Lightstreams PHT",
    symbol: "PHT",
    decimals: 18,
  },
  infoURL: "https://explorer.sirius.lightstreams.io",
  chainId: 162,
  networkId: 162,
} as const