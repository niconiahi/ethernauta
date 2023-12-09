/* eslint no-template-curly-in-string: 0 */
export const redlc = {
  name: "Redlight Chain Mainnet",
  shortName: "REDLC",
  chain: "REDLC",
  rpc: [
    "https://dataseed2.redlightscan.finance",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Redlight Coin",
    symbol: "REDLC",
    decimals: 18,
  },
  infoURL: "https://redlight.finance/",
  chainId: 2611,
  networkId: 2611,
  explorers: [
    {
      name: "REDLC Explorer",
      url: "https://redlightscan.finance",
      standard: "EIP3091",
    },
  ],
} as const