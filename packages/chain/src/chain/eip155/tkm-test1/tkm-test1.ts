/* eslint no-template-curly-in-string: 0 */
export const tkmTest1 = {
  name: "Thinkium Testnet Chain 1",
  shortName: "TKM-test1",
  chain: "Thinkium",
  rpc: [
    "https://test1.thinkiumrpc.net/",
  ],
  faucets: [
    "https://www.thinkiumdev.net/faucet",
  ],
  nativeCurrency: {
    name: "TKM",
    symbol: "TKM",
    decimals: 18,
  },
  infoURL: "https://thinkium.net/",
  chainId: 60001,
  networkId: 60001,
  explorers: [
    {
      name: "thinkiumscan",
      url: "https://test1.thinkiumscan.net",
      standard: "EIP3091",
    },
  ],
} as const