/* eslint no-template-curly-in-string: 0 */
export const astr = {
  name: "Astar",
  shortName: "astr",
  chain: "ASTR",
  icon: "astar",
  rpc: [
    "https://rpc.astar.network:8545",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Astar",
    symbol: "ASTR",
    decimals: 18,
  },
  infoURL: "https://astar.network/",
  chainId: 592,
  networkId: 592,
  explorers: [
    {
      name: "subscan",
      url: "https://astar.subscan.io",
      standard: "none",
    },
    {
      name: "blockscout",
      url: "https://blockscout.com/astar",
      standard: "EIP3091",
    },
  ],
} as const
