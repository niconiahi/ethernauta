/* eslint no-template-curly-in-string: 0 */
export const bobabeam = {
  name: "Bobabeam",
  shortName: "Bobabeam",
  chain: "Bobabeam",
  rpc: [
    "https://bobabeam.boba.network",
    "wss://wss.bobabeam.boba.network",
    "https://replica.bobabeam.boba.network",
    "wss://replica-wss.bobabeam.boba.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Boba Token",
    symbol: "BOBA",
    decimals: 18,
  },
  infoURL: "https://boba.network",
  chainId: 1294,
  networkId: 1294,
  explorers: [
    {
      name: "Bobabeam block explorer",
      url: "https://blockexplorer.bobabeam.boba.network",
      standard: "none",
    },
  ],
} as const
