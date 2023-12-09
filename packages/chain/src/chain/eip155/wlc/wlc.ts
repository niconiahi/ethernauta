/* eslint no-template-curly-in-string: 0 */
export const wlc = {
  name: "Worldland Mainnet",
  shortName: "WLC",
  chain: "Worldland",
  icon: "worldland",
  rpc: [
    "https://seoul.worldland.foundation",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Worldland",
    symbol: "WL",
    decimals: 18,
  },
  infoURL: "https://worldland.foundation",
  chainId: 103,
  networkId: 103,
  explorers: [
    {
      name: "Worldland Explorer",
      url: "https://scan.worldland.foundation",
      standard: "EIP3091",
    },
  ],
} as const
