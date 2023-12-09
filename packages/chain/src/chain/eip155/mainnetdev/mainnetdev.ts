/* eslint no-template-curly-in-string: 0 */
export const mainnetDev = {
  name: "Oort MainnetDev",
  shortName: "MainnetDev",
  title: "Oort MainnetDev",
  chain: "MainnetDev",
  icon: "oort",
  rpc: [
    "https://dev-rpc.oortech.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Oort",
    symbol: "CCN",
    decimals: 18,
  },
  infoURL: "https://oortech.com",
  chainId: 9700,
  networkId: 9700,
  explorers: [
    {
      name: "Oort MainnetDev Scan",
      url: "https://dev-scan.oortech.com",
      standard: "none",
    },
  ],
} as const
