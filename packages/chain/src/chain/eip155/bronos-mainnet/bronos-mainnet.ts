/* eslint no-template-curly-in-string: 0 */
export const bronosMainnet = {
  name: "Bronos Mainnet",
  shortName: "bronos-mainnet",
  chain: "Bronos",
  icon: "bronos",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "BRO",
    symbol: "BRO",
    decimals: 18,
  },
  infoURL: "https://bronos.org",
  chainId: 1039,
  networkId: 1039,
  explorers: [
    {
      name: "Bronos Explorer",
      url: "https://broscan.bronos.org",
      standard: "none",
    },
  ],
} as const