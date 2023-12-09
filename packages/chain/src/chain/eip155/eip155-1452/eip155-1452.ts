/* eslint no-template-curly-in-string: 0 */
export const eip155_1452 = {
  name: "GIL Testnet",
  shortName: "gil",
  chain: "GIL",
  icon: "gauss",
  rpc: [
    "https://rpc.giltestnet.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GANG",
    symbol: "GANG",
    decimals: 18,
  },
  infoURL: "https://gaussgang.com/",
  chainId: 1452,
  networkId: 1452,
  explorers: [
    {
      name: "GIL Explorer",
      url: "https://explorer.giltestnet.com",
      standard: "EIP3091",
    },
  ],
} as const
