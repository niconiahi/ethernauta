/* eslint no-template-curly-in-string: 0 */
export const es = {
  name: "EraSwap Mainnet",
  shortName: "es",
  chain: "ESN",
  icon: "eraswap",
  rpc: [
    "https://mainnet.eraswap.network",
    "https://rpc-mumbai.mainnet.eraswap.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EraSwap",
    symbol: "ES",
    decimals: 18,
  },
  infoURL: "https://eraswap.info/",
  chainId: 5197,
  networkId: 5197,
} as const
