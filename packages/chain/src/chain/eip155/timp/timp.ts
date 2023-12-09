/* eslint no-template-curly-in-string: 0 */
export const tImp = {
  name: "IMPERIUM TESTNET",
  shortName: "tIMP",
  chain: "tIMP",
  icon: "timp",
  rpc: [
    "https://data-aws-testnet.imperiumchain.com",
    "https://data-aws2-testnet.imperiumchain.com",
  ],
  faucets: [
    "https://faucet.imperiumchain.com/",
  ],
  nativeCurrency: {
    name: "tIMP",
    symbol: "tIMP",
    decimals: 18,
  },
  infoURL: "https://imperiumchain.com",
  chainId: 9818,
  networkId: 9818,
  explorers: [
    {
      name: "IMPERIUM TESTNET Explorer",
      url: "https://network.impscan.com",
      standard: "none",
    },
  ],
} as const
