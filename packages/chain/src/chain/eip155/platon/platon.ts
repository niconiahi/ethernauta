/* eslint no-template-curly-in-string: 0 */
export const platon = {
  name: "PlatON Mainnet",
  shortName: "platon",
  chain: "PlatON",
  icon: "platon",
  rpc: [
    "https://openapi2.platon.network/rpc",
    "wss://openapi2.platon.network/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LAT",
    symbol: "lat",
    decimals: 18,
  },
  infoURL: "https://www.platon.network",
  chainId: 210425,
  networkId: 1,
  explorers: [
    {
      name: "PlatON explorer",
      url: "https://scan.platon.network",
      standard: "none",
    },
  ],
} as const
