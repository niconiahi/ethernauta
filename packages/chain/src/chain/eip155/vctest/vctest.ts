/* eslint no-template-curly-in-string: 0 */
export const vctest = {
  name: "VinuChain Testnet",
  shortName: "VCTEST",
  chain: "VinuChain Testnet",
  icon: "vitainu-testnet",
  rpc: [
    "https://vinufoundation-rpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "VinuChain",
    symbol: "VС",
    decimals: 18,
  },
  infoURL: "https://vitainu.org",
  chainId: 206,
  networkId: 206,
  explorers: [
    {
      name: "VinuScan Testnet",
      url: "https://testnet.vinuscan.com",
      standard: "none",
    },
  ],
} as const
