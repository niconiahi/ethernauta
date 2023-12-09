/* eslint no-template-curly-in-string: 0 */
export const pangolin = {
  name: "Darwinia Pangolin Testnet",
  shortName: "pangolin",
  chain: "pangolin",
  rpc: [
    "https://pangolin-rpc.darwinia.network",
  ],
  faucets: [
    "https://docs.darwinia.network/pangolin-testnet-1e9ac8b09e874e8abd6a7f18c096ca6a",
  ],
  nativeCurrency: {
    name: "Pangolin Network Native Token",
    symbol: "PRING",
    decimals: 18,
  },
  infoURL: "https://darwinia.network/",
  chainId: 43,
  networkId: 43,
  explorers: [
    {
      name: "subscan",
      url: "https://pangolin.subscan.io",
      standard: "none",
    },
  ],
} as const