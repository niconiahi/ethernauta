/* eslint no-template-curly-in-string: 0 */
export const egem = {
  name: "EtherGem",
  shortName: "egem",
  chain: "EGEM",
  rpc: [
    "https://jsonrpc.egem.io/custom",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EtherGem Ether",
    symbol: "EGEM",
    decimals: 18,
  },
  infoURL: "https://egem.io",
  chainId: 1987,
  networkId: 1987,
  slip44: 1987,
} as const
