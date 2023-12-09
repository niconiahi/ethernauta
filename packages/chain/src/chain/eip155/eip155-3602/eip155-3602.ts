/* eslint no-template-curly-in-string: 0 */
export const eip155_3602 = {
  name: "PandoProject Testnet",
  shortName: "pando-testnet",
  chain: "PandoProject",
  icon: "pando",
  rpc: [
    "https://testnet.ethrpc.pandoproject.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "pando-token",
    symbol: "PTX",
    decimals: 18,
  },
  infoURL: "https://www.pandoproject.org/",
  chainId: 3602,
  networkId: 3602,
  explorers: [
    {
      name: "Pando Testnet Explorer",
      url: "https://testnet.explorer.pandoproject.org",
      standard: "none",
    },
  ],
} as const
