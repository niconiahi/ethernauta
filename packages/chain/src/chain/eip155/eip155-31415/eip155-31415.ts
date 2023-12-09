/* eslint no-template-curly-in-string: 0 */
export const eip155_31415 = {
  name: "Filecoin - Wallaby testnet",
  shortName: "filecoin-wallaby",
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
  chainId: 31415,
  networkId: 31415,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} as const
