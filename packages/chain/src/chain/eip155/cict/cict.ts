/* eslint no-template-curly-in-string: 0 */
export const cict = {
  name: "CIC Chain Testnet",
  shortName: "CICT",
  chain: "CICT",
  icon: "cicchain",
  rpc: [
    "https://testapi.cicscan.com",
  ],
  faucets: [
    "https://cicfaucet.com",
  ],
  nativeCurrency: {
    name: "Crazy Internet Coin",
    symbol: "CICT",
    decimals: 18,
  },
  infoURL: "https://www.cicchain.net",
  chainId: 1252,
  networkId: 1252,
  explorers: [
    {
      name: "CICscan",
      url: "https://testnet.cicscan.com",
      standard: "EIP3091",
    },
  ],
} as const
