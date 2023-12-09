/* eslint no-template-curly-in-string: 0 */
export const shib = {
  name: "ShibaChain",
  shortName: "shib",
  chain: "SHIB",
  rpc: [
    "https://rpc.shibchain.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "SHIBA INU COIN",
    symbol: "SHIB",
    decimals: 18,
  },
  infoURL: "https://shibchain.org",
  chainId: 27,
  networkId: 27,
  explorers: [
    {
      name: "Shiba Explorer",
      url: "https://exp.shibchain.org",
      standard: "none",
    },
  ],
} as const
