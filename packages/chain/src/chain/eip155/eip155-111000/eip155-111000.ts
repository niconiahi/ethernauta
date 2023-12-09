/* eslint no-template-curly-in-string: 0 */
export const eip155_111000 = {
  name: "Siberium Test Network",
  shortName: "testsbr",
  chain: "SBR",
  icon: "siberium",
  rpc: [
    "https://rpc.test.siberium.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TestSIBR",
    symbol: "SIBR",
    decimals: 18,
  },
  infoURL: "https://siberium.net",
  chainId: 111000,
  networkId: 111000,
  explorers: [
    {
      name: "Siberium Testnet Explorer - blockscout",
      url: "https://explorer.test.siberium.net",
      standard: "EIP3091",
    },
  ],
} as const
