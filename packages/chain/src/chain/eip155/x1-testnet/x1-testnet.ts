/* eslint no-template-curly-in-string: 0 */
export const x1Testnet = {
  name: "X1 Network",
  shortName: "x1-testnet",
  chain: "X1",
  rpc: [
    "https://x1-testnet.xen.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "XN",
    symbol: "XN",
    decimals: 18,
  },
  infoURL: "https://docs.xen.network/go-x1/",
  chainId: 204005,
  networkId: 204005,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.x1-testnet.xen.network",
      standard: "EIP3091",
    },
  ],
} as const
