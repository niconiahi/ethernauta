/* eslint no-template-curly-in-string: 0 */
export const vechain = {
  name: "VeChain",
  shortName: "vechain",
  chain: "VeChain",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "VeChain",
    symbol: "VET",
    decimals: 18,
  },
  infoURL: "https://vechain.org",
  chainId: 100009,
  networkId: 100009,
  explorers: [
    {
      name: "VeChain Stats",
      url: "https://vechainstats.com",
      standard: "none",
    },
    {
      name: "VeChain Explorer",
      url: "https://explore.vechain.org",
      standard: "none",
    },
  ],
} as const
