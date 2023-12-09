/* eslint no-template-curly-in-string: 0 */
export const phoenix = {
  name: "Phoenix Mainnet",
  shortName: "Phoenix",
  chain: "Phoenix",
  icon: "phoenix",
  rpc: [
    "https://rpc.phoenixplorer.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Phoenix",
    symbol: "PHX",
    decimals: 18,
  },
  infoURL: "https://cryptophoenix.org/phoenix",
  chainId: 13381,
  networkId: 13381,
  explorers: [
    {
      name: "phoenixplorer",
      url: "https://phoenixplorer.com",
      standard: "EIP3091",
    },
  ],
} as const
