/* eslint no-template-curly-in-string: 0 */
export const algl = {
  name: "Algol",
  shortName: "algl",
  chain: "algol",
  rpc: [
    "wss://fullnode.algol.cntrfg.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Algol",
    symbol: "ALGL",
    decimals: 18,
  },
  infoURL: "https://centrifuge.io",
  chainId: 2089,
  networkId: 2089,
} as const
