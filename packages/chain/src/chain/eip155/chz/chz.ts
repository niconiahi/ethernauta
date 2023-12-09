/* eslint no-template-curly-in-string: 0 */
export const chz = {
  name: "Chiliz Scoville Testnet",
  shortName: "chz",
  chain: "CHZ",
  icon: "chiliz",
  rpc: [
    "https://scoville-rpc.chiliz.com",
  ],
  faucets: [
    "https://scoville-faucet.chiliz.com",
  ],
  nativeCurrency: {
    name: "Chiliz",
    symbol: "CHZ",
    decimals: 18,
  },
  infoURL: "https://www.chiliz.com/en/chain",
  chainId: 88880,
  networkId: 88880,
  explorers: [
    {
      name: "scoville-explorer",
      url: "https://scoville-explorer.chiliz.com",
      standard: "none",
    },
  ],
} as const
