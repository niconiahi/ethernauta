/* eslint no-template-curly-in-string: 0 */
export const keth = {
  name: "Kinto Testnet",
  shortName: "keth",
  title: "Kinto Testnet",
  chain: "ETH",
  rpc: [
    "http://35.215.120.180:8545",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethereum.org",
  chainId: 42888,
  networkId: 42888,
  explorers: [
    {
      name: "kintoscan",
      url: "http://35.215.120.180:4000",
      standard: "EIP3091",
    },
  ],
} as const
