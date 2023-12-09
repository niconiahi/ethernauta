/* eslint no-template-curly-in-string: 0 */
export const stn = {
  name: "Smart Trade Networks",
  shortName: "STN",
  chain: "Smart Trade Networks",
  icon: "stn",
  rpc: [
    "https://beefledgerwallet.com:8544",
  ],
  faucets: [],
  nativeCurrency: {
    name: "STN",
    symbol: "STN",
    decimals: 18,
  },
  infoURL: "https://www.smarttradenetworks.com",
  chainId: 18122,
  networkId: 18122,
  explorers: [
    {
      name: "stnscan",
      url: "https://stnscan.com",
      standard: "none",
    },
  ],
} as const
