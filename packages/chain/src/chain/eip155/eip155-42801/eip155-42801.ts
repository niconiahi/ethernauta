/* eslint no-template-curly-in-string: 0 */
export const eip155_42801 = {
  name: "Gesoten Verse Testnet",
  shortName: "GST",
  chain: "Gesoten Verse",
  icon: "gesoten",
  rpc: [
    "https://rpc.testnet.verse.gesoten.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://gesoten.com/",
  chainId: 42801,
  networkId: 42801,
  explorers: [
    {
      name: "Gesoten Verse Testnet Explorer",
      url: "https://explorer.testnet.verse.gesoten.com",
      standard: "EIP3091",
    },
  ],
} as const
