/* eslint no-template-curly-in-string: 0 */
export const chainx = {
  name: "BEVM",
  shortName: "chainx",
  chain: "ChainX",
  rpc: [
    "https://rpc-1.bevm.io/",
    "https://rpc-2.bevm.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://chainx.org",
  chainId: 1501,
  networkId: 1501,
  explorers: [
    {
      name: "bevm scan",
      url: "https://scan.bevm.io",
      standard: "none",
    },
  ],
} as const
