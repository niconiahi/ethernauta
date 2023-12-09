/* eslint no-template-curly-in-string: 0 */
export const autobahnNetwork = {
  name: "Autobahn Network",
  shortName: "AutobahnNetwork",
  chain: "TXL",
  icon: "autobahn",
  rpc: [
    "https://rpc.autobahn.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TXL",
    symbol: "TXL",
    decimals: 18,
  },
  infoURL: "https://autobahn.network",
  chainId: 45000,
  networkId: 45000,
  explorers: [
    {
      name: "autobahn explorer",
      url: "https://explorer.autobahn.network",
      standard: "EIP3091",
    },
  ],
} as const
