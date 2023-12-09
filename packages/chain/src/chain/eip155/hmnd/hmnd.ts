/* eslint no-template-curly-in-string: 0 */
export const hmnd = {
  name: "Humanode Mainnet",
  shortName: "hmnd",
  chain: "HMND",
  rpc: [
    "https://explorer-rpc-http.mainnet.stages.humanode.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "eHMND",
    symbol: "eHMND",
    decimals: 18,
  },
  infoURL: "https://humanode.io",
  chainId: 5234,
  networkId: 5234,
  explorers: [
    {
      name: "Subscan",
      url: "https://humanode.subscan.io",
      standard: "EIP3091",
    },
  ],
} as const
