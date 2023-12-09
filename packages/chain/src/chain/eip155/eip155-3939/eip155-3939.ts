/* eslint no-template-curly-in-string: 0 */
export const eip155_3939 = {
  name: "DOS Tesnet",
  shortName: "dost",
  chain: "DOS",
  icon: "doschain",
  rpc: [
    "https://test.doschain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DOS",
    symbol: "DOS",
    decimals: 18,
  },
  infoURL: "http://doschain.io/",
  chainId: 3939,
  networkId: 3939,
  explorers: [
    {
      name: "DOScan-Test",
      url: "https://test.doscan.io",
      standard: "EIP3091",
    },
  ],
} as const
