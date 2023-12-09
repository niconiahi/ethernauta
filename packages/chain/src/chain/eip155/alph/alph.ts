/* eslint no-template-curly-in-string: 0 */
export const alph = {
  name: "Alph Network",
  shortName: "alph",
  chain: "ALPH",
  rpc: [
    "https://rpc.alph.network",
    "wss://rpc.alph.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Alph Network",
    symbol: "ALPH",
    decimals: 18,
  },
  infoURL: "https://alph.network",
  chainId: 8738,
  networkId: 8738,
  explorers: [
    {
      name: "alphscan",
      url: "https://explorer.alph.network",
      standard: "EIP3091",
    },
  ],
} as const
