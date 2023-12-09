/* eslint no-template-curly-in-string: 0 */
export const plexchain = {
  name: "Symplexia Smart Chain",
  shortName: "Plexchain",
  chain: "Plexchain",
  icon: "plexchain",
  rpc: [
    "https://plex-rpc.plexfinance.us",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Plex Native Token",
    symbol: "PLEX",
    decimals: 18,
  },
  infoURL: "https://plexfinance.us/",
  chainId: 1149,
  networkId: 1149,
  explorers: [
    {
      name: "Plexchain Explorer",
      url: "https://explorer.plexfinance.us",
      standard: "EIP3091",
    },
  ],
} as const
