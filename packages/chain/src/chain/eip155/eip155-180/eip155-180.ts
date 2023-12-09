/* eslint no-template-curly-in-string: 0 */
export const eip155_180 = {
  name: "AME Chain Mainnet",
  shortName: "ame",
  chain: "AME",
  rpc: [
    "https://node1.amechain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "AME",
    symbol: "AME",
    decimals: 18,
  },
  infoURL: "https://amechain.io/",
  chainId: 180,
  networkId: 180,
  explorers: [
    {
      name: "AME Scan",
      url: "https://amescan.io",
      standard: "EIP3091",
    },
  ],
} as const
