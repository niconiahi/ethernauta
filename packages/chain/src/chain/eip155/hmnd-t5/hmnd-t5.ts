/* eslint no-template-curly-in-string: 0 */
export const hmndT5 = {
  name: "Humanode Testnet 5 Israfel",
  shortName: "hmnd-t5",
  chain: "Humanode Testnet 5",
  rpc: [
    "https://explorer-rpc-http.testnet5.stages.humanode.io",
  ],
  faucets: [
    "https://t.me/HumanodeTestnet5FaucetBot",
  ],
  nativeCurrency: {
    name: "eHMND",
    symbol: "eHMND",
    decimals: 18,
  },
  infoURL: "https://humanode.io",
  chainId: 14853,
  networkId: 14853,
  explorers: [],
} as const
