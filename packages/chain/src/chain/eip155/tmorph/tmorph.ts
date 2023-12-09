/* eslint no-template-curly-in-string: 0 */
export const tmorph = {
  name: "Morph Testnet",
  shortName: "tmorph",
  chain: "ETH",
  rpc: [
    "https://rpc-testnet.morphl2.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://morphl2.io",
  chainId: 2710,
  networkId: 2710,
  explorers: [
    {
      name: "Morph Testnet Explorer",
      url: "https://explorer-testnet.morphl2.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge-testnet.morphl2.io",
      },
    ],
  },
} as const
