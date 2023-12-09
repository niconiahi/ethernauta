/* eslint no-template-curly-in-string: 0 */
export const srcTest = {
  name: "Scolcoin WeiChain Testnet",
  shortName: "SRC-test",
  chain: "SCOLWEI-testnet",
  icon: "scolcoin",
  rpc: [
    "https://testnet-rpc.scolcoin.com",
  ],
  faucets: [
    "https://faucet.scolcoin.com",
  ],
  nativeCurrency: {
    name: "Scolcoin",
    symbol: "SCOL",
    decimals: 18,
  },
  infoURL: "https://scolcoin.com",
  chainId: 6552,
  networkId: 6552,
  explorers: [
    {
      name: "Scolscan Testnet Explorer",
      url: "https://testnet-explorer.scolcoin.com",
      standard: "EIP3091",
    },
  ],
} as const
