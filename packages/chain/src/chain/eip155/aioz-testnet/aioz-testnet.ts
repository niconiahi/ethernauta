/* eslint no-template-curly-in-string: 0 */
export const aiozTestnet = {
  name: "AIOZ Network Testnet",
  shortName: "aioz-testnet",
  chain: "AIOZ",
  icon: "aioz",
  rpc: [
    "https://eth-ds.testnet.aioz.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "testAIOZ",
    symbol: "AIOZ",
    decimals: 18,
  },
  infoURL: "https://aioz.network",
  chainId: 4102,
  networkId: 4102,
  slip44: 60,
  explorers: [
    {
      name: "AIOZ Network Testnet Explorer",
      url: "https://testnet.explorer.aioz.network",
      standard: "EIP3091",
    },
  ],
} as const
