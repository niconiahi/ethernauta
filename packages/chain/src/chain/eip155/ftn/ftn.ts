/* eslint no-template-curly-in-string: 0 */
export const ftn = {
  name: "Bahamut",
  shortName: "ftn",
  title: "Bahamut mainnet",
  chain: "Bahamut",
  icon: "bahamut",
  rpc: [
    "https://rpc1.bahamut.io",
    "https://rpc2.bahamut.io",
    "wss://ws1.sahara.bahamutchain.com",
    "wss://ws2.sahara.bahamutchain.com",
    "https://bahamut.publicnode.com",
    "wss://bahamut.publicnode.com",
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
    name: "FTN",
    symbol: "FTN",
    decimals: 18,
  },
  infoURL: "https://bahamut.io",
  chainId: 5165,
  networkId: 5165,
  explorers: [
    {
      name: "blockscout",
      url: "https://ftnscan.com",
      standard: "none",
    },
  ],
} as const