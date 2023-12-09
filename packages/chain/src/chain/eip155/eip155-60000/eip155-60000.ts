/* eslint no-template-curly-in-string: 0 */
export const eip155_60000 = {
  name: "Thinkium Testnet Chain 0",
  shortName: "TKM-test0",
  chain: "Thinkium",
  rpc: [
    "https://test.thinkiumrpc.net/",
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
  chainId: 60000,
  networkId: 60000,
  explorers: [
    {
      name: "thinkiumscan",
      url: "https://test0.thinkiumscan.net",
      standard: "EIP3091",
    },
  ],
} as const
