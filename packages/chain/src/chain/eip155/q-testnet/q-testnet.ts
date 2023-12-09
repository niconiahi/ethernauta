/* eslint no-template-curly-in-string: 0 */
export const qTestnet = {
  name: "Q Testnet",
  shortName: "q-testnet",
  chain: "Q",
  icon: "q",
  rpc: [
    "https://rpc.qtestnet.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Q token",
    symbol: "Q",
    decimals: 18,
  },
  infoURL: "https://q.org/",
  chainId: 35443,
  networkId: 35443,
  explorers: [
    {
      name: "Q explorer",
      url: "https://explorer.qtestnet.org",
      standard: "EIP3091",
    },
  ],
} as const
