/* eslint no-template-curly-in-string: 0 */
export const metad = {
  name: "Metaplayerone Mainnet",
  shortName: "Metad",
  chain: "METAD",
  icon: "metad",
  rpc: [
    "https://rpc.metaplayer.one/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "METAD",
    symbol: "METAD",
    decimals: 18,
  },
  infoURL: "https://docs.metaplayer.one/",
  chainId: 2122,
  networkId: 2122,
  explorers: [
    {
      name: "Metad Scan",
      url: "https://scan.metaplayer.one",
      standard: "EIP3091",
    },
  ],
} as const
