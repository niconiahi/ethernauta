/* eslint no-template-curly-in-string: 0 */
export const _cloudwalkMainnet = {
  name: "CloudWalk Mainnet",
  shortName: "cloudwalk_mainnet",
  chain: "CloudWalk Mainnet",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "CloudWalk Native Token",
    symbol: "CWN",
    decimals: 18,
  },
  infoURL: "https://cloudwalk.io",
  chainId: 2009,
  networkId: 2009,
  explorers: [
    {
      name: "CloudWalk Mainnet Explorer",
      url: "https://explorer.mainnet.cloudwalk.io",
      standard: "none",
    },
  ],
} as const
