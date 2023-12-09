/* eslint no-template-curly-in-string: 0 */
export const bitfinity = {
  name: "Bitfinity Network Testnet",
  shortName: "Bitfinity",
  chain: "BFT",
  rpc: [
    "https://testnet.bitfinity.network",
  ],
  faucets: [
    "https://bitfinity.network/faucet",
  ],
  nativeCurrency: {
    name: "BITFINITY",
    symbol: "BFT",
    decimals: 18,
  },
  infoURL: "https://bitfinity.network",
  chainId: 355113,
  networkId: 355113,
  explorers: [
    {
      name: "Bitfinity Block Explorer",
      url: "https://explorer.bitfinity.network",
      standard: "EIP3091",
    },
  ],
} as const
