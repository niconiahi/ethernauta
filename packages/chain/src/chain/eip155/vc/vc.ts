/* eslint no-template-curly-in-string: 0 */
export const vc = {
  name: "VinuChain Network",
  shortName: "VC",
  chain: "VinuChain",
  icon: "vitainu",
  rpc: [
    "https://vinuchain-rpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "VinuChain",
    symbol: "VС",
    decimals: 18,
  },
  infoURL: "https://vitainu.org",
  chainId: 207,
  networkId: 207,
  explorers: [
    {
      name: "VinuScan",
      url: "https://vinuscan.com",
      standard: "none",
    },
  ],
} as const
