/* eslint no-template-curly-in-string: 0 */
export const tokt = {
  name: "OKExChain Testnet",
  shortName: "tokt",
  chain: "okexchain",
  rpc: [
    "https://exchaintestrpc.okex.org",
  ],
  faucets: [
    "https://www.okex.com/drawdex",
  ],
  nativeCurrency: {
    name: "OKExChain Global Utility Token in testnet",
    symbol: "OKT",
    decimals: 18,
  },
  infoURL: "https://www.okex.com/okexchain",
  chainId: 65,
  networkId: 65,
  explorers: [
    {
      name: "OKLink",
      url: "https://www.oklink.com/okexchain-test",
      standard: "EIP3091",
    },
  ],
} as const
