/* eslint no-template-curly-in-string: 0 */
export const tgton = {
  name: "GTON Testnet",
  shortName: "tgton",
  chain: "GTON Testnet",
  rpc: [
    "https://testnet.gton.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GCD",
    symbol: "GCD",
    decimals: 18,
  },
  infoURL: "https://gton.capital",
  chainId: 50021,
  networkId: 50021,
  explorers: [
    {
      name: "GTON Testnet Network Explorer",
      url: "https://explorer.testnet.gton.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-3",
  },
} as const
