/* eslint no-template-curly-in-string: 0 */
export const kroma = {
  name: "Kroma",
  shortName: "kroma",
  chain: "ETH",
  icon: "kroma",
  rpc: [
    "https://api.kroma.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://kroma.network",
  chainId: 255,
  networkId: 255,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.kroma.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://kroma.network/bridge",
      },
    ],
  },
} as const
