/* eslint no-template-curly-in-string: 0 */
export const filecoinHyperspace = {
  name: "Filecoin - Hyperspace testnet",
  shortName: "filecoin-hyperspace",
  chain: "FIL",
  icon: "filecoin",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "testnet filecoin",
    symbol: "tFIL",
    decimals: 18,
  },
  infoURL: "https://filecoin.io",
  chainId: 3141,
  networkId: 3141,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} as const
