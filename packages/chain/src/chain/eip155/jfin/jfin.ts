/* eslint no-template-curly-in-string: 0 */
export const jfin = {
  name: "JFIN Chain",
  shortName: "jfin",
  chain: "JFIN",
  rpc: [
    "https://rpc.jfinchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "JFIN Coin",
    symbol: "jfin",
    decimals: 18,
  },
  infoURL: "https://jfinchain.com",
  chainId: 3501,
  networkId: 3501,
  explorers: [
    {
      name: "JFIN Chain Explorer",
      url: "https://exp.jfinchain.com",
      standard: "EIP3091",
    },
  ],
} as const
