/* eslint no-template-curly-in-string: 0 */
export const ycc = {
  name: "YuanChain Mainnet",
  shortName: "ycc",
  chain: "YCC",
  icon: "ycc",
  rpc: [
    "https://mainnet.yuan.org/eth",
  ],
  faucets: [],
  nativeCurrency: {
    name: "YCC",
    symbol: "YCC",
    decimals: 18,
  },
  infoURL: "https://www.yuan.org",
  chainId: 3999,
  networkId: 3999,
  explorers: [
    {
      name: "YuanChain Explorer",
      url: "https://mainnet.yuan.org",
      standard: "none",
    },
  ],
} as const
