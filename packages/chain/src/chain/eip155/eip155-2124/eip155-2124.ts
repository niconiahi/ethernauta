/* eslint no-template-curly-in-string: 0 */
export const eip155_2124 = {
  name: "Metaplayerone Dubai Testnet",
  shortName: "MEU",
  chain: "MP1 Dubai-Testnet",
  rpc: [
    "https://rpc-dubai.mp1network.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Metaunit",
    symbol: "MEU",
    decimals: 18,
  },
  infoURL: "https://docs.metaplayer.one/",
  chainId: 2124,
  networkId: 2124,
  explorers: [
    {
      name: "MP1Scan",
      url: "https://dubai.mp1scan.io",
      standard: "EIP3091",
    },
  ],
} as const
