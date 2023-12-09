/* eslint no-template-curly-in-string: 0 */
export const moactest = {
  name: "MOAC testnet",
  shortName: "moactest",
  chain: "MOAC",
  rpc: [
    "https://gateway.moac.io/testnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MOAC",
    symbol: "mc",
    decimals: 18,
  },
  infoURL: "https://moac.io",
  chainId: 201,
  networkId: 201,
  explorers: [
    {
      name: "moac testnet explorer",
      url: "https://testnet.moac.io",
      standard: "none",
    },
  ],
} as const