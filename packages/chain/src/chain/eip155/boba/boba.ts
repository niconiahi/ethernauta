/* eslint no-template-curly-in-string: 0 */
export const boba = {
  name: "Boba Network",
  shortName: "Boba",
  chain: "ETH",
  rpc: [
    "https://mainnet.boba.network",
    "https://replica.boba.network",
    "https://boba-ethereum.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/boba-ethereum",
    "wss://boba-ethereum.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-ethereum",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://boba.network",
  chainId: 288,
  networkId: 288,
  explorers: [
    {
      name: "Bobascan",
      url: "https://bobascan.com",
      standard: "none",
    },
    {
      name: "Blockscout",
      url: "https://blockexplorer.boba.network",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://gateway.boba.network",
      },
    ],
  },
} as const
