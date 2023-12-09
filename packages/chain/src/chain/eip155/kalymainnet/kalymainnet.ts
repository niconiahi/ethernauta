/* eslint no-template-curly-in-string: 0 */
export const kalymainnet = {
  name: "KalyChain Mainnet",
  shortName: "kalymainnet",
  chain: "KLC",
  icon: "kalychain",
  rpc: [
    "https://rpc.kalychain.io/rpc",
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
    name: "KalyCoin",
    symbol: "KLC",
    decimals: 18,
  },
  infoURL: "https://kalychain.io",
  chainId: 3888,
  networkId: 3888,
  explorers: [
    {
      name: "KalyScan",
      url: "https://kalyscan.io",
      standard: "EIP3091",
    },
  ],
} as const
