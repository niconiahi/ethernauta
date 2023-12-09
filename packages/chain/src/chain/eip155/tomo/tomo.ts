/* eslint no-template-curly-in-string: 0 */
export const tomo = {
  name: "TomoChain",
  shortName: "tomo",
  chain: "TOMO",
  rpc: [
    "https://rpc.tomochain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TomoChain",
    symbol: "TOMO",
    decimals: 18,
  },
  infoURL: "https://tomochain.com",
  chainId: 88,
  networkId: 88,
  slip44: 889,
} as const
