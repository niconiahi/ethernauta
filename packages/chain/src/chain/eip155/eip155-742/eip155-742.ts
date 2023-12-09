/* eslint no-template-curly-in-string: 0 */
export const eip155_742 = {
  name: "Script Testnet",
  shortName: "SPAY",
  chain: "SPAY",
  rpc: [
    "https://testeth-rpc-api.script.tv/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Script",
    symbol: "SPAY",
    decimals: 18,
  },
  infoURL: "https://token.script.tv",
  chainId: 742,
  networkId: 742,
  explorers: [
    {
      name: "Script Explorer",
      url: "https://explorer.script.tv",
      standard: "none",
    },
  ],
} as const
