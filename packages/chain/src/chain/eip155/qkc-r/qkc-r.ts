/* eslint no-template-curly-in-string: 0 */
export const qkcR = {
  name: "QuarkChain Mainnet Root",
  shortName: "qkc-r",
  chain: "QuarkChain",
  rpc: [
    "http://jrpc.mainnet.quarkchain.io:38391",
  ],
  faucets: [],
  nativeCurrency: {
    name: "QKC",
    symbol: "QKC",
    decimals: 18,
  },
  infoURL: "https://www.quarkchain.io",
  chainId: 100000,
  networkId: 100000,
} as const
