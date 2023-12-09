/* eslint no-template-curly-in-string: 0 */
export const ambros = {
  name: "Ambros Chain Mainnet",
  shortName: "ambros",
  chain: "ambroschain",
  rpc: [
    "https://api.ambros.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "AMBROS",
    symbol: "AMBROS",
    decimals: 18,
  },
  infoURL: "https://ambros.network",
  chainId: 880,
  networkId: 880,
  explorers: [
    {
      name: "Ambros Chain Explorer",
      url: "https://ambrosscan.com",
      standard: "none",
    },
  ],
} as const
