/* eslint no-template-curly-in-string: 0 */
export const eip155_1038 = {
  name: "Bronos Testnet",
  shortName: "bronos-testnet",
  chain: "Bronos",
  icon: "bronos",
  rpc: [
    "https://evm-testnet.bronos.org",
  ],
  faucets: [
    "https://faucet.bronos.org",
  ],
  nativeCurrency: {
    name: "tBRO",
    symbol: "tBRO",
    decimals: 18,
  },
  infoURL: "https://bronos.org",
  chainId: 1038,
  networkId: 1038,
  explorers: [
    {
      name: "Bronos Testnet Explorer",
      url: "https://tbroscan.bronos.org",
      standard: "none",
    },
  ],
} as const
