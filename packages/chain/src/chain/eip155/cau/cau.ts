/* eslint no-template-curly-in-string: 0 */
export const cau = {
  name: "Canxium Mainnet",
  shortName: "cau",
  chain: "CAU",
  icon: "canxium",
  rpc: [
    "https://rpc.canxium.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Canxium",
    symbol: "CAU",
    decimals: 18,
  },
  infoURL: "https://canxium.org",
  chainId: 3003,
  networkId: 3003,
  explorers: [
    {
      name: "canxium explorer",
      url: "https://explorer.canxium.org",
      standard: "none",
    },
  ],
} as const
