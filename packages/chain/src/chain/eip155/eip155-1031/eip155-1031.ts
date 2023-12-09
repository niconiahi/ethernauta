/* eslint no-template-curly-in-string: 0 */
export const eip155_1031 = {
  name: "Proxy Network Testnet",
  shortName: "prx",
  chain: "Proxy Network",
  rpc: [
    "http://128.199.94.183:8041",
  ],
  faucets: [],
  nativeCurrency: {
    name: "PRX",
    symbol: "PRX",
    decimals: 18,
  },
  infoURL: "https://theproxy.network",
  chainId: 1031,
  networkId: 1031,
  explorers: [
    {
      name: "proxy network testnet",
      url: "http://testnet-explorer.theproxy.network",
      standard: "EIP3091",
    },
  ],
} as const
