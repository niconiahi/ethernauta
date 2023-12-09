/* eslint no-template-curly-in-string: 0 */
export const enter = {
  name: "EnterChain Mainnet",
  shortName: "enter",
  chain: "ENTER",
  icon: "enter",
  rpc: [
    "https://tapi.entercoin.net/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EnterCoin",
    symbol: "ENTER",
    decimals: 18,
  },
  infoURL: "https://entercoin.net",
  chainId: 1214,
  networkId: 1214,
  explorers: [
    {
      name: "Enter Explorer - Expenter",
      url: "https://explorer.entercoin.net",
      standard: "EIP3091",
    },
  ],
} as const