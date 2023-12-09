/* eslint no-template-curly-in-string: 0 */
export const wbt = {
  name: "WhiteBIT Network",
  shortName: "wbt",
  chain: "WBT",
  icon: "whitebit",
  rpc: [
    "https://rpc.whitebit.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "WhiteBIT Coin",
    symbol: "WBT",
    decimals: 18,
  },
  infoURL: "https://whitebit.network",
  chainId: 1875,
  networkId: 1875,
  explorers: [
    {
      name: "wb-explorer",
      url: "https://explorer.whitebit.network",
      standard: "EIP3091",
    },
  ],
} as const
