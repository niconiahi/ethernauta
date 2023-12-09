/* eslint no-template-curly-in-string: 0 */
export const eip155_54211 = {
  name: "Haqq Chain Testnet",
  shortName: "ISLMT",
  chain: "TestEdge2",
  rpc: [
    "https://rpc.eth.testedge2.haqq.network",
  ],
  faucets: [
    "https://testedge2.haqq.network",
  ],
  nativeCurrency: {
    name: "Islamic Coin",
    symbol: "ISLMT",
    decimals: 18,
  },
  infoURL: "https://islamiccoin.net",
  chainId: 54211,
  networkId: 54211,
  explorers: [
    {
      name: "TestEdge HAQQ Explorer",
      url: "https://explorer.testedge2.haqq.network",
      standard: "EIP3091",
    },
  ],
} as const
