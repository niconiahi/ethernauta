/* eslint no-template-curly-in-string: 0 */
export const jbc = {
  name: "JIBCHAIN L1",
  shortName: "jbc",
  chain: "JBC",
  rpc: [
    "https://rpc-l1.jibchain.net",
    "https://jib-rpc.inan.in.th",
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
    name: "JIBCOIN",
    symbol: "JBC",
    decimals: 18,
  },
  infoURL: "https://jibchain.net",
  chainId: 8899,
  networkId: 8899,
  explorers: [
    {
      name: "JIBCHAIN Explorer",
      url: "https://exp-l1.jibchain.net",
      standard: "EIP3091",
    },
  ],
} as const
