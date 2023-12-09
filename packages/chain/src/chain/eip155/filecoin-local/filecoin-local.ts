/* eslint no-template-curly-in-string: 0 */
export const filecoinLocal = {
  name: "Filecoin - Local testnet",
  shortName: "filecoin-local",
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
  chainId: 31415926,
  networkId: 31415926,
  slip44: 1,
  explorers: [],
  status: "incubating",
} as const