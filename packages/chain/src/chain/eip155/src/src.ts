/* eslint no-template-curly-in-string: 0 */
export const src = {
  name: "Scolcoin Mainnet",
  shortName: "SRC",
  chain: "SCOLWEI",
  icon: "scolcoin",
  rpc: [
    "https://mainnet-rpc.scolcoin.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Scolcoin",
    symbol: "SCOL",
    decimals: 18,
  },
  infoURL: "https://scolcoin.com",
  chainId: 65450,
  networkId: 65450,
  explorers: [
    {
      name: "Scolscan Explorer",
      url: "https://explorer.scolcoin.com",
      standard: "EIP3091",
    },
  ],
} as const
