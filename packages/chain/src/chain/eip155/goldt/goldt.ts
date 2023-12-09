/* eslint no-template-curly-in-string: 0 */
export const goldt = {
  name: "Hammer Chain Mainnet",
  shortName: "GOLDT",
  chain: "HammerChain",
  rpc: [
    "https://www.hammerchain.io/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GOLDT",
    symbol: "GOLDT",
    decimals: 18,
  },
  infoURL: "https://www.hammerchain.io",
  chainId: 25888,
  networkId: 25888,
  explorers: [
    {
      name: "Hammer Chain Explorer",
      url: "https://www.hammerchain.io",
      standard: "none",
    },
  ],
} as const
