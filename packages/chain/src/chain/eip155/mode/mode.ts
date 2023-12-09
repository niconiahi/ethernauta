/* eslint no-template-curly-in-string: 0 */
export const mode = {
  name: "Mode",
  shortName: "mode",
  chain: "ETH",
  icon: "mode",
  rpc: [
    "https://mainnet.mode.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.mode.network/",
  chainId: 34443,
  networkId: 34443,
  explorers: [
    {
      name: "modescout",
      url: "https://explorer.mode.network",
      standard: "none",
    },
  ],
} as const
