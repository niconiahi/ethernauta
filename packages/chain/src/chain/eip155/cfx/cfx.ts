/* eslint no-template-curly-in-string: 0 */
export const cfx = {
  name: "Conflux eSpace",
  shortName: "cfx",
  chain: "Conflux",
  icon: "conflux",
  rpc: [
    "https://evm.confluxrpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CFX",
    symbol: "CFX",
    decimals: 18,
  },
  infoURL: "https://confluxnetwork.org",
  chainId: 1030,
  networkId: 1030,
  explorers: [
    {
      name: "Conflux Scan",
      url: "https://evm.confluxscan.net",
      standard: "none",
    },
  ],
} as const
