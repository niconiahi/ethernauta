/* eslint no-template-curly-in-string: 0 */
export const kar = {
  name: "Karura Network",
  shortName: "kar",
  chain: "KAR",
  rpc: [
    "https://eth-rpc-karura.aca-api.network",
    "wss://eth-rpc-karura.aca-api.network",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Karura Token",
    symbol: "KAR",
    decimals: 18,
  },
  infoURL: "https://acala.network/karura",
  chainId: 686,
  networkId: 686,
  slip44: 686,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.karura.network",
      standard: "EIP3091",
    },
  ],
} as const