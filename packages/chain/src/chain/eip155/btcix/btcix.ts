/* eslint no-template-curly-in-string: 0 */
export const btcix = {
  name: "BTCIX Network",
  shortName: "btcix",
  chain: "BTCIX",
  rpc: [
    "https://seed.btcix.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTCIX Network",
    symbol: "BTCIX",
    decimals: 18,
  },
  infoURL: "https://bitcolojix.org",
  chainId: 19845,
  networkId: 19845,
  explorers: [
    {
      name: "BTCIXScan",
      url: "https://btcixscan.com",
      standard: "none",
    },
  ],
} as const
