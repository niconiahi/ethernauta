/* eslint no-template-curly-in-string: 0 */
export const tokb = {
  name: "X1 Testnet",
  shortName: "tokb",
  chain: "X1",
  rpc: [
    "https://testrpc.x1.tech",
    "https://x1testrpc.okx.com",
  ],
  faucets: [
    "https://www.okx.com/x1/faucet",
  ],
  features: [],
  nativeCurrency: {
    name: "X1 Global Utility Token in testnet",
    symbol: "OKB",
    decimals: 18,
  },
  infoURL: "https://www.okx.com/x1",
  chainId: 195,
  networkId: 195,
  explorers: [
    {
      name: "OKLink",
      url: "https://www.oklink.com/x1-test",
      standard: "EIP3091",
    },
  ],
  status: "active",
} as const
