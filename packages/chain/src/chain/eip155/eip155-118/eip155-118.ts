/* eslint no-template-curly-in-string: 0 */
export const eip155_118 = {
  name: "Arcology Testnet",
  shortName: "arcology",
  chain: "Arcology",
  icon: "acolicon",
  rpc: [
    "https://testnet.arcology.network/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Arcology Coin",
    symbol: "Acol",
    decimals: 18,
  },
  infoURL: "https://arcology.network/",
  chainId: 118,
  networkId: 118,
  explorers: [
    {
      name: "arcology",
      url: "https://testnet.arcology.network/explorer",
      standard: "none",
    },
  ],
} as const
