/* eslint no-template-curly-in-string: 0 */
export const paw = {
  name: "PAWCHAIN Testnet",
  shortName: "PAW",
  chain: "PAW",
  rpc: [
    "https://pawchainx.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "PAW",
    symbol: "PAW",
    decimals: 18,
  },
  infoURL: "https://pawchainx.com/",
  chainId: 542,
  networkId: 542,
  explorers: [
    {
      name: "PAWCHAIN Testnet",
      url: "https://pawscan.io",
      standard: "none",
    },
  ],
} as const
