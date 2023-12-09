/* eslint no-template-curly-in-string: 0 */
export const emerald = {
  name: "Oasis Emerald",
  shortName: "emerald",
  chain: "Emerald",
  icon: "oasis",
  rpc: [
    "https://emerald.oasis.dev",
    "wss://emerald.oasis.dev/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Emerald Rose",
    symbol: "ROSE",
    decimals: 18,
  },
  infoURL: "https://docs.oasis.io/dapp/emerald",
  chainId: 42262,
  networkId: 42262,
  explorers: [
    {
      name: "Oasis Emerald Explorer",
      url: "https://explorer.emerald.oasis.dev",
      standard: "EIP3091",
    },
  ],
} as const
