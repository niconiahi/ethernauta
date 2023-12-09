/* eslint no-template-curly-in-string: 0 */
export const laos = {
  name: "LAOS Arrakis",
  shortName: "laos",
  title: "LAOS Testnet Arrakis",
  chain: "LAOS",
  icon: "laos",
  rpc: [
    "https://arrakis.gorengine.com/own",
    "wss://arrakis.gorengine.com/own",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LAOS",
    symbol: "LAOS",
    decimals: 18,
  },
  infoURL: "https://www.laosfoundation.io/",
  chainId: 667,
  networkId: 667,
  explorers: [
    {
      name: "blockscout",
      url: "https://arrakis.gorengine.com",
      standard: "EIP3091",
    },
  ],
} as const
