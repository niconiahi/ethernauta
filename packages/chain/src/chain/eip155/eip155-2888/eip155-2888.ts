/* eslint no-template-curly-in-string: 0 */
export const eip155_2888 = {
  name: "Boba Network Goerli Testnet",
  shortName: "BobaGoerli",
  chain: "ETH",
  rpc: [
    "https://goerli.boba.network/",
    "wss://wss.goerli.boba.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://boba.network",
  chainId: 2888,
  networkId: 2888,
  explorers: [
    {
      name: "Blockscout",
      url: "https://testnet.bobascan.com",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-5",
    bridges: [
      {
        url: "https://gateway.boba.network",
      },
    ],
  },
} as const
