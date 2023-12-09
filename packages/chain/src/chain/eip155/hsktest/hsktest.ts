/* eslint no-template-curly-in-string: 0 */
export const hsktest = {
  name: "HashKey Chain Testnet",
  shortName: "hsktest",
  chain: "HashKey",
  icon: "hsk",
  rpc: [
    "https://testnet.hashkeychain/rpc",
  ],
  faucets: [
    "https://testnet.hashkeychain/faucet",
  ],
  nativeCurrency: {
    name: "HashKey Token",
    symbol: "tHSK",
    decimals: 18,
  },
  infoURL: "https://www.hashkey.com",
  chainId: 230315,
  networkId: 230315,
  explorers: [
    {
      name: "HashKey Chain Testnet Explorer",
      url: "https://testnet.hashkeyscan.io",
      standard: "none",
    },
  ],
} as const
