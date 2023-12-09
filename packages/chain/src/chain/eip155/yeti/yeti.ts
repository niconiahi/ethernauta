/* eslint no-template-curly-in-string: 0 */
export const yeti = {
  name: "Nepal Blockchain Network",
  shortName: "yeti",
  chain: "YETI",
  rpc: [
    "https://api.nepalblockchain.dev",
    "https://api.nepalblockchain.network",
  ],
  faucets: [
    "https://faucet.nepalblockchain.network",
  ],
  nativeCurrency: {
    name: "Nepal Blockchain Network Ether",
    symbol: "YETI",
    decimals: 18,
  },
  infoURL: "https://nepalblockchain.network",
  chainId: 977,
  networkId: 977,
} as const