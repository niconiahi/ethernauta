/* eslint no-template-curly-in-string: 0 */
export const all = {
  name: "ALL Mainnet",
  shortName: "ALL",
  chain: "ALL",
  icon: "alltra",
  rpc: [
    "https://mainnet-rpc.alltra.global",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ALL",
    symbol: "ALL",
    decimals: 18,
  },
  infoURL: "https://alltra.world",
  chainId: 651940,
  networkId: 651940,
  explorers: [
    {
      name: "Alltra SmartChain Explorer",
      url: "https://alltra.global",
      standard: "EIP3091",
    },
  ],
} as const
