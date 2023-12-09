/* eslint no-template-curly-in-string: 0 */
export const eip155_10243 = {
  name: "Arthera Testnet",
  shortName: "aa",
  chain: "AA",
  icon: "arthera",
  rpc: [
    "https://rpc-test.arthera.net",
  ],
  faucets: [
    "https://faucet.arthera.net",
  ],
  nativeCurrency: {
    name: "Arthera",
    symbol: "AA",
    decimals: 18,
  },
  infoURL: "https://docs.arthera.net",
  chainId: 10243,
  networkId: 10243,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer-test.arthera.net",
      standard: "EIP3091",
    },
  ],
} as const
