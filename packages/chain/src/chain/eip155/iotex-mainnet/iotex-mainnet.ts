/* eslint no-template-curly-in-string: 0 */
export const iotexMainnet = {
  name: "IoTeX Network Mainnet",
  shortName: "iotex-mainnet",
  chain: "iotex.io",
  rpc: [
    "https://babel-api.mainnet.iotex.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "IoTeX",
    symbol: "IOTX",
    decimals: 18,
  },
  infoURL: "https://iotex.io",
  chainId: 4689,
  networkId: 4689,
  explorers: [
    {
      name: "iotexscan",
      url: "https://iotexscan.io",
      standard: "EIP3091",
    },
  ],
} as const