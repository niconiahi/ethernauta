/* eslint no-template-curly-in-string: 0 */
export const eip155_5000 = {
  name: "Mantle",
  shortName: "mantle",
  chain: "ETH",
  icon: "mantle",
  rpc: [
    "https://rpc.mantle.xyz",
    "https://mantle.publicnode.com",
    "wss://mantle.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  infoURL: "https://mantle.xyz",
  chainId: 5000,
  networkId: 5000,
  explorers: [
    {
      name: "Mantle Explorer",
      url: "https://explorer.mantle.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.mantle.xyz",
      },
    ],
  },
} as const
