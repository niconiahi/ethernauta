/* eslint no-template-curly-in-string: 0 */
export const clo = {
  name: "Callisto Mainnet",
  shortName: "clo",
  chain: "CLO",
  rpc: [
    "https://rpc.callisto.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Callisto",
    symbol: "CLO",
    decimals: 18,
  },
  infoURL: "https://callisto.network",
  chainId: 820,
  networkId: 1,
  slip44: 820,
} as const
