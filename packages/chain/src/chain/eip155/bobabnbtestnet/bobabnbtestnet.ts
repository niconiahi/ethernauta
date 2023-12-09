/* eslint no-template-curly-in-string: 0 */
export const bobaBnbTestnet = {
  name: "Boba BNB Testnet",
  shortName: "BobaBnbTestnet",
  chain: "Boba BNB Testnet",
  rpc: [
    "https://testnet.bnb.boba.network",
    "wss://wss.testnet.bnb.boba.network",
    "https://replica.testnet.bnb.boba.network",
    "wss://replica-wss.testnet.bnb.boba.network",
    "https://boba-bnb-testnet.gateway.tenderly.co",
    "wss://boba-bnb-testnet.gateway.tenderly.co",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Boba Token",
    symbol: "BOBA",
    decimals: 18,
  },
  infoURL: "https://boba.network",
  chainId: 9728,
  networkId: 9728,
  explorers: [
    {
      name: "Boba BNB Testnet block explorer",
      url: "https://blockexplorer.testnet.bnb.boba.network",
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
