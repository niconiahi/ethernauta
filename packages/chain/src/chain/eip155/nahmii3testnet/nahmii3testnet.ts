/* eslint no-template-curly-in-string: 0 */
export const nahmii3Testnet = {
  name: "Nahmii 3 Testnet",
  shortName: "Nahmii3Testnet",
  chain: "Nahmii",
  icon: "nahmii",
  rpc: [
    "https://ngeth.testnet.n3.nahmii.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://nahmii.io",
  chainId: 4062,
  networkId: 4062,
  explorers: [
    {
      name: "Nahmii 3 Testnet Explorer",
      url: "https://explorer.testnet.n3.nahmii.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-3",
    bridges: [
      {
        url: "https://bridge.testnet.n3.nahmii.io",
      },
    ],
  },
} as const
