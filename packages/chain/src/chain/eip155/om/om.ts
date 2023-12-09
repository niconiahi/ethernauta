/* eslint no-template-curly-in-string: 0 */
export const om = {
  name: "OM Platform Mainnet",
  shortName: "om",
  chain: "omplatform",
  rpc: [
    "https://rpc-cnx.omplatform.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OMCOIN",
    symbol: "OM",
    decimals: 18,
  },
  infoURL: "https://omplatform.com/",
  chainId: 1246,
  networkId: 1246,
  explorers: [
    {
      name: "OMSCAN - Expenter",
      url: "https://omscan.omplatform.com",
      standard: "none",
    },
  ],
} as const
